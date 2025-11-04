import { prisma } from '@my-fullstack-repo/shared-prisma-client';
import { Role } from '@my-fullstack-repo/shared-prisma-types';
import * as bcrypt from 'bcrypt';

async function main() {
  console.log('Seeding database...');

  // Delete all existing users
  await prisma.user.deleteMany({});
  console.log('Deleted all existing users');

  const users = [];

  for (let i = 1; i <= 20; i++) {
    users.push({
      email: `user${i}@example.com`,
      password: await bcrypt.hash('password123', 10),
      firstName: `User${i}`,
      lastName: 'Test',
      role: Role.USER,
      dob: new Date(1990, i % 12, i),
      address: `Address ${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  for (let i = 1; i <= 10; i++) {
    users.push({
      email: `admin${i}@example.com`,
      password: await bcrypt.hash('adminpass', 10),
      firstName: `Admin${i}`,
      lastName: 'Test',
      role: Role.ADMIN,
      dob: new Date(1985, i % 12, i),
      address: `Admin Address ${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Insert all users
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true, // optional
  });

  console.log('Inserted 30 users (20 users + 10 admins)');

  console.log('Seeding database finished successfully...');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
