import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(tenantId: string) {
    return this.prisma.category.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async create(tenantId: string, dto: CreateCategoryDto) {
    const slug = slugify(dto.name);

    if (!slug) {
      throw new BadRequestException('Nom de categorie invalide.');
    }

    const existing = await this.prisma.category.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.category.create({
      data: {
        tenantId,
        name: dto.name,
        slug,
      },
    });
  }
}
