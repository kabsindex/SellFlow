import { UserRole } from '@prisma/client';

export interface AuthUser {
  sub: string;
  tenantId: string | null;
  role: UserRole;
  name: string;
}
