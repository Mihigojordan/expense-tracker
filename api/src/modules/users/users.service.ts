import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Role } from '../../../generated/prisma';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; email: string; password: string }): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: Role.MEMBER,
      },
    });
  }
  async createAdmin(data: { name: string; email: string; password: string }): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: Role.ADMIN,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

    async updatePassword(userId: number, newPassword: string): Promise<User> {
    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update the user in the database
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }


  // Helper method to exclude sensitive fields
  exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[],
  ): Omit<User, Key> {
    for (let key of keys) {
      delete user[key];
    }
    return user;
  }
}
