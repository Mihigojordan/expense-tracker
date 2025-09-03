import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmNewPassword: string;

  constructor(partial: Partial<ChangePasswordDto> = {}) {
    Object.assign(this, partial);
    
    // Custom validation to check if passwords match
    if (this.newPassword && this.confirmNewPassword && this.newPassword !== this.confirmNewPassword) {
      throw new Error('New password and confirmation password do not match');
    }
  }
}