import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust path as needed
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { User } from '../../../generated/prisma';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto,user:User): Promise<CategoryResponseDto> {
    if(user.role != 'ADMIN'){
      throw new ForbiddenException('you not admin')
    }
    // Check if category with same name already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name }
    });

    if (existingCategory) {
      throw new ConflictException(`Category with name '${createCategoryDto.name}' already exists`);
    }

    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return category;
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return categories;
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto,user:any): Promise<CategoryResponseDto> {
    if(user.role != 'ADMIN'){
      throw new ForbiddenException('you not admin')
    }
    // Check if category exists
    await this.findOne(id);

    // If updating name, check if new name already exists
    if (updateCategoryDto.name) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { name: updateCategoryDto.name }
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(`Category with name '${updateCategoryDto.name}' already exists`);
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return updatedCategory;
  }

  async remove(id: number,user:any): Promise<void> {
    if(user.role != 'ADMIN'){
      throw new ForbiddenException('you not admin')
    }
    // Check if category exists
    await this.findOne(id);

    // Check if category has related expenses
    const categoryWithExpenses = await this.prisma.category.findUnique({
      where: { id },
      include: { expenses: true },
    });

    if(!categoryWithExpenses){
      throw new NotFoundException(`Category with ID ${id} not found`); 
    }

    if (categoryWithExpenses.expenses.length > 0) {
      throw new ConflictException(`Cannot delete category with ID ${id} as it has ${categoryWithExpenses.expenses.length} related expense(s)`);
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }

  async exists(id: number): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    return !!category;
  }

  async existsByName(name: string): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { name },
    });

    return !!category;
  }
}
