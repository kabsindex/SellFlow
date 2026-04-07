import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BillingService } from './billing.service';

@Processor('subscription-expiry')
export class BillingProcessor extends WorkerHost {
  constructor(private readonly billingService: BillingService) {
    super();
  }

  async process(job: Job<{ tenantId: string }>) {
    await this.billingService.downgradeExpiredSubscription(job.data.tenantId);
  }
}
