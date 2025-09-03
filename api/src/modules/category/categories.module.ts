import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust path as needed
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
   imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'supersecret', // use env variable
      signOptions: { expiresIn: '10h' },
    }),
  ],
})
export class CategoriesModule {}