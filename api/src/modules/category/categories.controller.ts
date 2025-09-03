import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../../generated/prisma';

@Controller('categories')
@UseGuards(JwtAuthGuard,RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto,@Req() req): Promise<CategoryResponseDto> {
    return this.categoriesService.create(createCategoryDto,req.user);
  }

  @Get()
  async findAll(@Req() req): Promise<CategoryResponseDto[]> {
console.log('category:',req.user);

    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(id);
  }

  @Get(':id/exists')
  async exists(@Param('id', ParseIntPipe) id: number,): Promise<{ exists: boolean }> {
    const exists = await this.categoriesService.exists(id);
    return { exists };
  }

  @Get('name/:name/exists')
  async existsByName(@Param('name') name: string): Promise<{ exists: boolean }> {
    const exists = await this.categoriesService.existsByName(name);
    return { exists };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(id, updateCategoryDto,req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT,)
  async remove(@Param('id', ParseIntPipe) id: number,@Req() req): Promise<void> {
    return this.categoriesService.remove(id,req.user);
  }
}
