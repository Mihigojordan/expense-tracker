import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'supersecret', // use env variable
      signOptions: { expiresIn: '10h' },
    }),
  ],
})
export class ExpensesModule {}
