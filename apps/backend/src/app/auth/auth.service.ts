import { Injectable } from '@nestjs/common';
import { prisma } from '@my-fullstack-repo/shared-prisma-client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}
  async login(email: string, password: string): Promise<string | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    // Create a signed JWT
    const token = jwt.sign(
      { sub: user.id, role: user.role },
      this.configService.get<string>('JWT_SECRET'),
      { expiresIn: '1d' }
    );

    return token;
  }
}
