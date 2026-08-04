import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { UpdateCustomerDto } from './dto/updateCustomer.dto';
import { Customer } from './customer.enitity';
import { LoanInformationStatus } from '../loan_info/loan_infor.entity';
import { StorageService } from '../storage/storage.service';

// Helper to check if a string is a base64 encoded image
function isBase64Image(str: string): boolean {
  if (!str) return false;
  return /^data:image\/[a-zA-Z+.-]+;base64,/.test(str);
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    private readonly storageService: StorageService,
  ) { }

  /**
   * Helper to extract R2 object key from stored URL or key
   */
  private getStorageKeyFromUrl(urlOrKey: string): string | null {
    if (!urlOrKey) return null;
    const clean = urlOrKey.startsWith('/') ? urlOrKey.slice(1) : urlOrKey;
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      const parts = clean.split('/');
      const folderIndex = parts.findIndex((p) => p === 'customers');
      if (folderIndex !== -1) {
        return parts.slice(folderIndex).join('/');
      }
    }
    if (clean.startsWith('customers/')) {
      return clean;
    }
    return null;
  }

  /**
   * Converts base64 image data into a Buffer and uploads directly to Cloudflare R2
   */
  private async saveBase64Image(base64Str: string): Promise<string> {
    const matches = base64Str.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image format');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let extension = '.jpg';
    if (mimeType === 'image/png') extension = '.png';
    else if (mimeType === 'image/webp') extension = '.webp';
    else if (mimeType === 'image/gif') extension = '.gif';
    else if (mimeType === 'image/svg+xml') extension = '.svg';

    const filename = `cus_${Date.now()}_${Math.round(Math.random() * 1e6)}${extension}`;

    const result = await this.storageService.uploadBuffer(
      buffer,
      mimeType,
      'customers',
      filename,
    );

    return result.key;
  }

  async create(dto: CreateCustomerDto) {
    let imagePath = dto.image;
    if (dto.image && isBase64Image(dto.image)) {
      try {
        imagePath = await this.saveBase64Image(dto.image);
      } catch (err: any) {
        console.error('Failed to save base64 image to Cloudflare R2:', err);
      }
    }
    const customer = this.customerRepo.create({ ...dto, image: imagePath });
    return await this.customerRepo.save(customer);
  }
  async countActiveLoansByCustomerId(customerId: string): Promise<number> {
    try {
      const customer = await this.customerRepo.findOne({
        where: { id: customerId },
        relations: { loanInformation: true },
      });

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }

      return customer.loanInformation?.filter(
        (loan) => loan.status === LoanInformationStatus.IN_PAYMENT
      ).length || 0;
    } catch (error: any) {
      throw new Error(`DB Error: ${error.message} -> Code: ${error.code}`);
    }
  }

  async getAll() {
    try {

      const customer = await this.customerRepo.find({
        relations: {
          user: true,
          loanInformation: true,
        },
        order: { createdAt: 'DESC' },
      });
      // countActiveLoansByCustomerId(customer.id)
      const data = customer.map(async (customer) => {
        const activeLoansCount = await this.countActiveLoansByCustomerId(customer.id);
        return {
          ...customer,
          activeLoansCount,
        };
      });

      return { data: { count: data.length, customer: await Promise.all(data) } }
    } catch (error: any) {
      // This sends the REAL database error back to Postman instead of "Internal server error"
      throw new Error(`DB Error: ${error.message} -> Code: ${error.code}`);
    }
  }

  async getOne(id: string) {
    const findCustomer = await this.customerRepo.findOne({
      where: { id },
      relations: {
        user: true,
        loanInformation: {
          paymentTables: true,
        },
      },
      order: {
        loanInformation: {
          createdAt: 'DESC',
          paymentTables: {
            paymentRequiredDate: 'ASC',
          },
        },
      },
    });

    if (!findCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return findCustomer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.getOne(id);
    const updateData: any = { ...dto };

    if (dto.image !== undefined && dto.image !== customer.image) {
      // Delete old file if it exists (R2 or local)
      if (customer.image) {
        const r2Key = this.getStorageKeyFromUrl(customer.image);
        if (r2Key) {
          await this.storageService.deleteFile(r2Key).catch((e) =>
            console.error('Failed to delete old image from R2:', e),
          );
        } else if (customer.image.startsWith('/storage/customers/')) {
          const oldPath = path.join(process.cwd(), customer.image);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (e) {
              console.error('Failed to delete old image file:', e);
            }
          }
        }
      }

      // Save new base64 image if applicable
      if (dto.image && isBase64Image(dto.image)) {
        try {
          updateData.image = await this.saveBase64Image(dto.image);
        } catch (err: any) {
          console.error('Failed to save base64 image during update:', err);
        }
      }
    }

    Object.assign(customer, updateData);
    return await this.customerRepo.save(customer);
  }

  async remove(id: string) {
    const customer = await this.getOne(id);

    // Delete stored image file on deletion (R2 or local)
    if (customer.image) {
      const r2Key = this.getStorageKeyFromUrl(customer.image);
      if (r2Key) {
        await this.storageService.deleteFile(r2Key).catch((e) =>
          console.error('Failed to delete image from R2 on customer removal:', e),
        );
      } else if (customer.image.startsWith('/storage/customers/')) {
        const filePath = path.join(process.cwd(), customer.image);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.error('Failed to delete image file on customer removal:', e);
          }
        }
      }
    }

    await this.customerRepo.remove(customer);
    return { message: 'Customer deleted successfully' };
  }
}
