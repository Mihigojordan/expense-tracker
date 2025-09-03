import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        amount: dto.amount,
        currency: dto.currency,
        note: dto.note,
        spentAt: new Date(dto.spentAt),
      },
    });
  }

  async findAll(userId: number,role:string) {
    if(role == 'MEMBER'){

      return this.prisma.expense.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });
    }
    else if(role == 'ADMIN'){
            return this.prisma.expense.findMany({
       
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  async findOne(userId: number, id: number,role?:string) {
   
     if(role == 'ADMIN'){
    const expense = await this.prisma.expense.findFirst({
      where: { id },
      include: { category: true },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }
  else{
    
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
    
  }
  }

  async update(userId: number, id: number, dto: UpdateExpenseDto) {
    await this.findOne(userId, id); // ensure exists
    return this.prisma.expense.update({
      where: { id },
      data: {
        ...dto,
        spentAt: dto.spentAt ? new Date(dto.spentAt) : undefined,
      },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id); // ensure exists
    return this.prisma.expense.delete({ where: { id } });
  }
}
