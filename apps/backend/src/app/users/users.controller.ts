import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AdminUpdatable,
  Role,
  SafeUser,
} from '@my-fullstack-repo/shared-prisma-types';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<SafeUser[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<SafeUser> {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async updateUser(
    @Body() user: AdminUpdatable,
    @Param('id') id: string
  ): Promise<SafeUser> {
    console.log('Updating user with id:', id);
    // Later, replace with JWT auth to get current user email dynamically
    return this.usersService.updateUser(user, id);
  }
}
