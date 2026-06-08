import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, name: dto.name },
      select: { id: true, email: true, name: true, role: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...tokens,
    };
  }

  async refresh(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: token },
      include: { user: true },
    });
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const tokens = await this.generateTokens(
      session.user.id,
      session.user.email,
      session.user.role,
    );
    await this.prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: tokens.refreshToken, expiresAt: this.sevenDaysFromNow() },
    });
    return tokens;
  }

  async logout(refreshToken: string) {
    await this.prisma.session.deleteMany({ where: { refreshToken } });
    return { message: 'Logged out' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtSecret || !jwtRefreshSecret) {
      throw new Error('JWT_SECRET and JWT_REFRESH_SECRET are required');
    }
    const payload = { sub: userId, email, role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtRefreshSecret,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt: this.sevenDaysFromNow(),
      },
    });
  }

  private sevenDaysFromNow() {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
}
