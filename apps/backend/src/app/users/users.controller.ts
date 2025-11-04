import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AdminUpdatable,
  Role,
  SafeUser,
} from '@my-fullstack-repo/shared-prisma-types';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { AuthenticatedRequest } from '../types/authenticated-request';
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Req() req: AuthenticatedRequest): Promise<SafeUser[]> {
    return this.usersService.getAllUsers(req.user.userId);
  }

  @Get('me')
  async getCurrentUser(@Req() req: AuthenticatedRequest): Promise<SafeUser> {
    return this.usersService.getCurrentUser(req.user.userId);
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
    return this.usersService.updateUser(user, id);
  }
}
