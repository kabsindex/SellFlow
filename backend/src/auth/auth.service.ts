import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  PlanType,
  StoreCurrency,
  SubscriptionStatus,
  User,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { buildPlanCapabilities } from '../common/utils/plan-capabilities';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthUser } from '../common/interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { whatsappNumber: dto.whatsappNumber },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Un compte existe déjà avec ce numéro WhatsApp.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const storeSlug = await this.buildUniqueStoreSlug(dto.storeName);

    const user = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: dto.storeName,
          slug: slugify(dto.storeName) || `store-${Date.now()}`,
          currentPlan: PlanType.BASIC,
          premiumPreview: false,
        },
      });

      const store = await tx.store.create({
        data: {
          tenantId: tenant.id,
          name: dto.storeName,
          slug: storeSlug,
          brandingEnabled: true,
          allowCustomTheme: false,
          defaultCurrency: StoreCurrency.USD,
        },
      });

      await tx.storeTheme.create({
        data: {
          storeId: store.id,
        },
      });

      await tx.subscription.create({
        data: {
          tenantId: tenant.id,
          planType: PlanType.BASIC,
          status: SubscriptionStatus.ACTIVE,
          amount: 0,
          currency: StoreCurrency.USD,
          startsAt: new Date(),
        },
      });

      await tx.whatsAppConnection.create({
        data: {
          tenantId: tenant.id,
          phoneNumber: dto.whatsappNumber,
          displayName: dto.name || dto.storeName,
          isActive: true,
          defaultPrefix: 'Bonjour,',
        },
      });

      return tx.user.create({
        data: {
          tenantId: tenant.id,
          name: dto.name,
          email: dto.email,
          whatsappNumber: dto.whatsappNumber,
          passwordHash,
          role: UserRole.OWNER,
        },
      });
    });

    return this.buildAuthResponse(user);
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: { whatsappNumber: dto.whatsappNumber },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    return this.buildAuthResponse(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<AuthUser>(refreshToken, {
        secret: this.configService.get<string>(
          'JWT_REFRESH_SECRET',
          'change-me-refresh',
        ),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Session invalide.');
      }

      const refreshMatches = await bcrypt.compare(
        refreshToken,
        user.refreshTokenHash,
      );

      if (!refreshMatches) {
        throw new UnauthorizedException('Session invalide.');
      }

      return this.buildAuthResponse(user);
    } catch (_error) {
      throw new UnauthorizedException('Impossible de rafraichir la session.');
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: {
          include: {
            store: {
              include: {
                theme: true,
              },
            },
            subscriptions: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable.');
    }

    const subscription = user.tenant?.subscriptions?.[0] ?? null;
    const store = user.tenant?.store ?? null;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        whatsappNumber: user.whatsappNumber,
        role: user.role,
      },
      tenant: user.tenant
        ? {
            id: user.tenant.id,
            name: user.tenant.name,
            slug: user.tenant.slug,
            premiumPreview: user.tenant.premiumPreview,
          }
        : null,
      store,
      capabilities: buildPlanCapabilities(
        user.tenant?.currentPlan ?? PlanType.BASIC,
        subscription,
        store,
        user.tenant?.premiumPreview ?? false,
      ),
    };
  }

  private async buildAuthResponse(user: User) {
    const payload: AuthUser = {
      sub: user.id,
      tenantId: user.tenantId ?? null,
      role: user.role,
      name: user.name,
    };
    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'change-me'),
      expiresIn: accessExpiresIn as never,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'change-me-refresh',
      ),
      expiresIn: refreshExpiresIn as never,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: await bcrypt.hash(refreshToken, 10),
      },
    });

    return {
      accessToken,
      refreshToken,
      session: await this.me(user.id),
    };
  }

  private async buildUniqueStoreSlug(value: string) {
    const baseSlug = slugify(value) || `store-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.store.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    return slug;
  }
}

