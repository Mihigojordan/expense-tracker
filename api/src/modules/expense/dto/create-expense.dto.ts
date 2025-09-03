import { IsInt, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsString, Length, IsDateString } from 'class-validator';

export class CreateExpenseDto {
  @IsInt()
  categoryId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @Length(3, 3)
  currency: string; // ISO 4217, e.g. USD

  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty()
  @IsDateString()
  spentAt: string;
}
