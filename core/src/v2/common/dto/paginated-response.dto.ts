import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class PaginatedResponseDto<T> {
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;

  constructor(data: T[], total: number, page: number = 1, limit: number = 10) {
    this.data = data;
    const totalPages = Math.ceil(total / limit) || 1;
    this.meta = {
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
      totalPages,
    };
  }
}
