import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MaketouCheckoutPayload {
  subscriptionId: string;
  tenantId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface MaketouCheckoutResponse {
  cart: {
    id: string;
    status: 'waiting_payment' | 'completed' | 'abandoned' | 'payment_failed';
  };
  redirectUrl: string;
}

export interface MaketouCart {
  id: string;
  status: 'waiting_payment' | 'completed' | 'abandoned' | 'payment_failed';
  paymentId?: string;
  customerInfo?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  };
  meta?: Record<string, string>;
}

@Injectable()
export class MaketouService {
  constructor(private readonly configService: ConfigService) {}

  async createSubscriptionCheckout(payload: MaketouCheckoutPayload) {
    const appUrl = this.getRedirectAppUrl();

    return this.request<MaketouCheckoutResponse>(
      '/api/v1/stores/cart/checkout',
      {
        method: 'POST',
        body: JSON.stringify({
          productDocumentId: this.getRequiredConfig(
            'MAKETOU_PRODUCT_DOCUMENT_ID',
          ),
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone,
          redirectURL: `${appUrl}/billing/return?subscriptionId=${payload.subscriptionId}`,
          meta: {
            tenantId: payload.tenantId,
            userId: payload.userId,
            subscriptionId: payload.subscriptionId,
            plan: 'PREMIUM_MONTHLY',
          },
        }),
      },
    );
  }

  async getCart(cartId: string) {
    return this.request<MaketouCart>(`/api/v1/stores/cart/${cartId}`, {
      method: 'GET',
    });
  }

  private async request<T>(path: string, init: RequestInit) {
    const response = await fetch(`${this.getApiBaseUrl()}${path}`, {
      ...init,
      headers: this.buildHeaders(init.headers),
    });

    const payload = (await response.json().catch(() => null)) as
      | { code?: string; message?: string }
      | T
      | null;

    if (!response.ok) {
      const message = this.extractErrorMessage(payload);

      throw new BadGatewayException(
        `Maketou a refusé la requête : ${message ? message : 'erreur inconnue'}.`,
      );
    }

    return payload as T;
  }

  private getApiBaseUrl() {
    return this.getRequiredConfig('MAKETOU_API_BASE').replace(/\/$/, '');
  }

  private getRedirectAppUrl() {
    const appUrl = this.getRequiredConfig('APP_URL').replace(/\/$/, '');

    try {
      const parsedUrl = new URL(appUrl);

      if (parsedUrl.hostname === 'localhost') {
        parsedUrl.hostname = '127.0.0.1';
      }

      return parsedUrl.toString().replace(/\/$/, '');
    } catch (_error) {
      return appUrl;
    }
  }

  private getRequiredConfig(key: string) {
    const value = this.configService.get<string>(key)?.trim();

    if (!value || value === 'change-me') {
      throw new InternalServerErrorException(
        `Configuration manquante: ${key}.`,
      );
    }

    return value;
  }

  private buildHeaders(headers?: RequestInit['headers']) {
    const requestHeaders = new Headers(headers);

    requestHeaders.set(
      'Authorization',
      `Bearer ${this.getRequiredConfig('MAKETOU_API_KEY')}`,
    );
    requestHeaders.set('Content-Type', 'application/json');

    return requestHeaders;
  }

  private extractErrorMessage(payload: { code?: string; message?: string } | unknown) {
    if (!payload || typeof payload !== 'object') {
      return 'erreur inconnue';
    }

    if ('message' in payload && typeof payload.message === 'string') {
      return payload.message;
    }

    if ('message' in payload && Array.isArray(payload.message)) {
      return payload.message
        .map((item) => {
          if (
            item &&
            typeof item === 'object' &&
            'constraints' in item &&
            item.constraints &&
            typeof item.constraints === 'object'
          ) {
            return Object.values(item.constraints).join(', ');
          }

          return String(item);
        })
        .join(' | ');
    }

    if ('code' in payload && typeof payload.code === 'string') {
      return payload.code;
    }

    return 'erreur inconnue';
  }
}
