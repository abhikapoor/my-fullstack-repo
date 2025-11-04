import { Request } from 'express';
import { Role } from '@my-fullstack-repo/shared-prisma-types';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    role: Role;
  };
}
