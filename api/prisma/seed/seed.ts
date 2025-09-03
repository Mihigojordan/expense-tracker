import { PrismaClient, Role, User, Category } from '../../generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Seed Users
  const usersData = [
    {
      name: 'Jane',
      email: 'jane.smith@example.com',
      password: 'Mihigo12@',
      role: Role.ADMIN,
    },
    {
      name: 'mihigo',
      email: 'mihigojordan8@gmail.com',
      password: 'Mihigo12@',
      role: Role.MEMBER,
    },
  ];

  const users: User[] = []; // <-- explicitly typed

  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        passwordHash: hashedPassword,
        role: u.role,
      },
    });
    users.push(user);
  }

  // 2️⃣ Seed Categories
  const categoriesData = ['Food', 'Transport', 'Entertainment', 'Health', 'Education'];
  const categories: Category[] = []; 

  for (const name of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(category);
  }

  // 3️⃣ Seed Expenses
  const expensesData = [
    {
      userEmail: 'mihigojordan8@gmail.com',
      categoryName: 'Food',
      amount: 25.5,
      currency: 'USD',
      note: 'Lunch at restaurant',
      spentAt: new Date('2025-09-01T12:30:00Z'),
    },
    {
      userEmail: 'mihigojordan8@gmail.com',
      categoryName: 'Transport',
      amount: 15,
      currency: 'USD',
      note: 'Taxi fare',
      spentAt: new Date('2025-09-02T08:00:00Z'),
    },
    {
      userEmail: 'mihigojordan8@gmail.com',
      categoryName: 'Entertainment',
      amount: 50,
      currency: 'USD',
      note: 'Movie tickets',
      spentAt: new Date('2025-09-03T20:00:00Z'),
    },
  ];

  for (const e of expensesData) {
    const user = users.find(u => u.email === e.userEmail);
    const category = categories.find(c => c.name === e.categoryName);

    if (user && category) {
      await prisma.expense.create({
        data: {
          userId: user.id,
          categoryId: category.id,
          amount: e.amount,
          currency: e.currency,
          note: e.note,
          spentAt: e.spentAt,
        },
      });
    }
  }

  console.log('✅ Seed completed successfully (users, categories, expenses)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
