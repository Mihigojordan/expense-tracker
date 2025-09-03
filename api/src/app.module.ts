import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { CategoriesModule } from './modules/category/categories.module';
import { ExpensesModule } from './modules/expense/expenses.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';


@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
   
     {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
  ],
})
export class AppModule { }
