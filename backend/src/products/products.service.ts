import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { BillingService } from '../billing/billing.service';
import { slugify } from '../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async list(tenantId: string, search?: string) {
    return this.prisma.product.findMany({
      where: {
        tenantId,
        OR: search
          ? [
              { name: { contains: search } },
              { referenceNumber: { contains: search } },
              { slug: { contains: slugify(search) } },
            ]
          : undefined,
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(tenantId: string, dto: CreateProductDto) {
    await this.billingService.ensureCanCreateProduct(tenantId);
    const categoryId = await this.resolveCategoryId(tenantId, dto);

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          tenantId,
          categoryId,
          name: dto.name,
          slug: await this.buildUniqueProductSlug(tenantId, dto.name),
          description: dto.description,
          referenceNumber: dto.referenceNumber,
          price: dto.price,
          stock: dto.stock,
          status:
            dto.stock === 0
              ? ProductStatus.OUT_OF_STOCK
              : dto.status ?? ProductStatus.PUBLISHED,
        },
        include: {
          category: true,
          images: true,
        },
      });

      if (dto.imageUrls?.length) {
        await tx.productImage.createMany({
          data: dto.imageUrls.map((url, index) => ({
            tenantId,
            productId: product.id,
            url,
            sortOrder: index,
          })),
        });
      }

      return tx.product.findUniqueOrThrow({
        where: { id: product.id },
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    });
  }

  async getById(tenantId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        tenantId,
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produit introuvable.');
    }

    return product;
  }

  async update(tenantId: string, productId: string, dto: UpdateProductDto) {
    await this.getById(tenantId, productId);
    const categoryId = await this.resolveCategoryId(tenantId, dto);

    return this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: {
          name: dto.name,
          description: dto.description,
          referenceNumber: dto.referenceNumber,
          categoryId,
          price: dto.price,
          stock: dto.stock,
          status:
            dto.stock === 0
              ? ProductStatus.OUT_OF_STOCK
              : dto.status ?? undefined,
        },
      });

      if (dto.imageUrls) {
        await tx.productImage.deleteMany({
          where: { productId },
        });

        if (dto.imageUrls.length) {
          await tx.productImage.createMany({
            data: dto.imageUrls.map((url, index) => ({
              tenantId,
              productId,
              url,
              sortOrder: index,
            })),
          });
        }
      }

      return tx.product.findUniqueOrThrow({
        where: { id: productId },
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    });
  }

  async remove(tenantId: string, productId: string) {
    await this.getById(tenantId, productId);
    await this.prisma.product.delete({
      where: { id: productId },
    });

    return { success: true };
  }

  private async resolveCategoryId(
    tenantId: string,
    dto: Pick<CreateProductDto, 'categoryId' | 'newCategoryName'>,
  ) {
    if (dto.newCategoryName) {
      const createdCategory = await this.categoriesService.create(tenantId, {
        name: dto.newCategoryName,
      });
      return createdCategory.id;
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: dto.categoryId,
          tenantId,
        },
      });

      if (!category) {
        throw new BadRequestException('Categorie introuvable.');
      }
    }

    return dto.categoryId;
  }

  private async buildUniqueProductSlug(tenantId: string, name: string) {
    const baseSlug = slugify(name) || `product-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;

    while (
      await this.prisma.product.findUnique({
        where: {
          tenantId_slug: {
            tenantId,
            slug,
          },
        },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    return slug;
  }
}
