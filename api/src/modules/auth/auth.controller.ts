// auth.controller.ts
import {
    Controller,
    Post,
    Get,
    Body,
    HttpCode,
    HttpStatus,
    Res,
    Req,
    UseGuards,
    UnauthorizedException,
    Patch,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
    @Post('register-admin')
    @HttpCode(HttpStatus.CREATED)
    async registerAdmin(@Body() registerDto: RegisterDto) {
        return this.authService.registerAdmin(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponseDto> {
        const { accessToken, refreshToken } = await this.authService.login(loginDto);
       
      
        // Set new refresh token as httpOnly cookie (token rotation)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });
        // Set new refresh token as httpOnly cookie (token rotation)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });
        // Return access token to be stored in memory by frontend
        return { accessToken };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponseDto> {
        const refreshToken = req.cookies?.refreshToken;
       
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await this.authService.refresh(refreshToken);

        // Set new refresh token as httpOnly cookie (token rotation)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });
        // Set new refresh token as httpOnly cookie (token rotation)
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });

        // Return new access token
        return { accessToken };
    }

    @Patch('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @Req() req: any,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        await this.authService.changePassword(req.user.id, changePasswordDto);
        return { message: 'Password changed successfully' };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        await this.authService.logout(req.user.id);
       
        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Req() req: any) {
        console.log(req.user);
        
        const user = await this.usersService.findById(req.user.id);

        console.log('new',user);
        
    
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        // Return user info (without sensitive data like password)
        return this.usersService.exclude(user, ['passwordHash']);
    }
}