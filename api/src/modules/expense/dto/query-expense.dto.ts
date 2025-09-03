import { IsOptional, IsInt, IsString, IsDateString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryExpenseDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}