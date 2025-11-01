// auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '@my-fullstack-repo/shared-prisma-types';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
