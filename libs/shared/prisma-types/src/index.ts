import type { User } from './user';
export type { User } from './user';
export { Role } from './role';
export type SafeUser = Omit<User, 'password'>;
export type AdminUpdatable = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'email' | 'password'
>;
