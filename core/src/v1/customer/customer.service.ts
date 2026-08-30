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
import { CommonService } from '../comon/comon.service';

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
    private readonly commonService: CommonService,
  ) {}

  async create(dto: CreateCustomerDto) {
    let imagePath = dto.image;
    if (dto.image && isBase64Image(dto.image)) {
      try {
        imagePath = await this.commonService.saveBase64Image(
          dto.image,
          'customers',
        );
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

      return (
        customer.loanInformation?.filter(
          (loan) => loan.status === LoanInformationStatus.IN_PAYMENT,
        ).length || 0
      );
    } catch (error: any) {
      throw new Error(`DB Error: ${error.message} -> Code: ${error.code}`);
    }
  }

  async getAll(userIdOrToken?: string) {
    try {
      let userId: string | null = null;
      if (userIdOrToken) {
        if (userIdOrToken.includes('.') || userIdOrToken.startsWith('Bearer ')) {
          userId = this.commonService.getUserIdFromToken(userIdOrToken);
        } else {
          userId = userIdOrToken;
        }
      }

      const whereCondition = userId ? { userId } : {};

      const customer = await this.customerRepo.find({
        where: whereCondition,
        relations: {
          user: true,
          loanInformation: true,
        },
        order: { createdAt: 'DESC' },
      });

      const data = customer.map(async (customer) => {
        const activeLoansCount = await this.countActiveLoansByCustomerId(
          customer.id,
        );
        return {
          ...customer,
          activeLoansCount,
        };
      });

      return {
        data: { count: data.length, customer: await Promise.all(data) },
      };
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
        const r2Key = this.commonService.getStorageKeyFromUrl(
          customer.image,
          'customers',
        );
        if (r2Key) {
          await this.storageService
            .deleteFile(r2Key)
            .catch((e) =>
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
          updateData.image = await this.commonService.saveBase64Image(
            dto.image,
            'customers',
          );
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
      const r2Key = this.commonService.getStorageKeyFromUrl(
        customer.image,
        'customers',
      );
      if (r2Key) {
        await this.storageService
          .deleteFile(r2Key)
          .catch((e) =>
            console.error(
              'Failed to delete image from R2 on customer removal:',
              e,
            ),
          );
      } else if (customer.image.startsWith('/storage/customers/')) {
        const filePath = path.join(process.cwd(), customer.image);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.error(
              'Failed to delete image file on customer removal:',
              e,
            );
          }
        }
      }
    }

    await this.customerRepo.remove(customer);
    return { message: 'Customer deleted successfully' };
  }
}
