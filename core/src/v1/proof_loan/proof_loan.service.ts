import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProofLoan } from './proof_loan.entity';
import { UploadProofDTO } from './dto/upload_proof.dto';
import { CommonService } from '../comon/comon.service';

function isBase64Image(str: string): boolean {
  if (!str) return false;
  return /^data:image\/[a-zA-Z+.-]+;base64,/.test(str);
}

@Injectable()
export class ProofLoanService {
  constructor(
    @InjectRepository(ProofLoan)
    private readonly proofLoanRepository: Repository<ProofLoan>,
    private readonly commonService: CommonService,
  ) { }

  // Upload single image proof
  async uploadImage(data: UploadProofDTO): Promise<ProofLoan> {
    let imagePath = data.path;
    if (data.path && isBase64Image(data.path)) {
      try {
        imagePath = await this.commonService.saveBase64Image(data.path, 'proofs');
      } catch (err: any) {
        console.error('Failed to save base64 proof image:', err);
      }
    } else if (data.path) {
      imagePath =
        this.commonService.getStorageKeyFromUrl(data.path, 'proofs') || data.path;
    }

    const record = this.proofLoanRepository.create({
      ...data,
      path: imagePath,
    });
    return await this.proofLoanRepository.save(record);
  }

  // Upload multiple proof images
  async uploadMultipleImages(
    loanInformationId: string,
    proofs: UploadProofDTO[],
  ): Promise<ProofLoan[]> {
    if (!proofs || proofs.length === 0) return [];

    const records = await Promise.all(
      proofs.map(async (item) => {
        let imagePath = item.path;
        if (item.path && isBase64Image(item.path)) {
          try {
            imagePath = await this.commonService.saveBase64Image(
              item.path,
              'proofs',
            );
          } catch (err: any) {
            console.error('Failed to save base64 proof image:', err);
          }
        } else if (item.path) {
          imagePath =
            this.commonService.getStorageKeyFromUrl(item.path, 'proofs') ||
            item.path;
        }

        return this.proofLoanRepository.create({
          name: item.name,
          path: imagePath,
          loanInformationId,
        });
      }),
    );

    return await this.proofLoanRepository.save(records);
  }

  // Get proof images by loanInformationId
  async getByLoanId(loanInformationId: string): Promise<ProofLoan[]> {
    return await this.proofLoanRepository.find({
      where: { loanInformationId },
      order: { createdAt: 'DESC' },
    });
  }
}