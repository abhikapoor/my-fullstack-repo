import { User, Role } from './generated/client';
export type SafeUser = Omit<User, 'password'>;
export type AdminUpdatable = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'email' | 'password'>;
export type { User };
export { Role };
