import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  User,
  SafeUser,
  AdminUpdatable,
} from '@my-fullstack-repo/shared-prisma-types';
import { prisma } from '../../client';

@Injectable()
export class UsersService {
  async getAllUsers(currentUserId: string): Promise<SafeUser[]> {
    console.log('currentUserId', currentUserId);
    const users: User[] = await prisma.user.findMany({
      where: {
        id: currentUserId ? { not: currentUserId } : undefined,
      },
    });
    return users.map(({ password, ...rest }) => rest);
  }

  async getUserById(id: string): Promise<SafeUser> {
    const user: User = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...rest } = user;
    return rest;
  }

  async updateUser(updatedUser: AdminUpdatable, id: string): Promise<SafeUser> {
    const target: User = await prisma.user.findUnique({
      where: { id },
    });
    if (!target) throw new NotFoundException('User not found.');

    const dataToUpdate = {
      email: target.email, // email is not updatable
      password: target.password, // password is not updatable,
      firstName: updatedUser.firstName ?? target.firstName,
      lastName: updatedUser.lastName ?? target.lastName,
      dob: updatedUser.dob ?? target.dob,
      address: updatedUser.address ?? target.address,
      role: updatedUser.role ?? target.role,
    };

    try {
      const result: User = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });

      const { password, ...rest } = result;
      return rest;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getCurrentUser(id: string): Promise<SafeUser> {
    console.log('UsersService - getCurrentUser ID:', id);
    const user: User = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...rest } = user;
    return rest;
  }
}
