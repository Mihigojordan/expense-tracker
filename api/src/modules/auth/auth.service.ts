// auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  private refreshTokens = new Map<number, string>(); // In production, use Redis

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    console.log(registerDto);
   
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if(existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const user = await this.usersService.create(registerDto);
    console.log(user);
   
    return this.usersService.exclude(user, ['passwordHash']);
  }
  async registerAdmin(registerDto: RegisterDto) {
    console.log(registerDto);
   
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if(existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const user = await this.usersService.createAdmin(registerDto);
    console.log(user);
   
    return this.usersService.exclude(user, ['passwordHash']);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    console.log(loginDto);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.usersService.validatePassword(user, loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, id: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store refresh token (in production, use Redis with TTL)
    this.refreshTokens.set(user.id, refreshToken);

    return { accessToken, refreshToken };
  }


  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const storedToken = this.refreshTokens.get(payload.id);
     
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      console.log('logging refresh ');

      const user = await this.usersService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens (refresh token rotation)
      const newPayload = { email: user.email, id: user.id, role: user.role };
      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

      // Update stored refresh token
      this.refreshTokens.set(user.id, newRefreshToken);
      console.log('refreshed');
      

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    // Get user
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Validate current password
    const isCurrentPasswordValid = await this.usersService.validatePassword(user, currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Check if new password is different from current password
    const isSamePassword = await this.usersService.validatePassword(user, newPassword);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Update password
    await this.usersService.updatePassword(userId, newPassword);

    // Invalidate all refresh tokens for this user (force re-login on all devices)
    this.refreshTokens.delete(userId);
  }

  async logout(userId: number): Promise<void> {
    this.refreshTokens.delete(userId);
  }
}
