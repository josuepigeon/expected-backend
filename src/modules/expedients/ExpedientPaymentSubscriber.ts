import { EventBus } from "../_shared/models/EventBus";
import { ExpedientsRepository } from "./models/ExpedientsRepository";
import { HandlePaymentSuccessUseCase } from "./use-cases/handle-payment-success-use-case/HandlePaymentSuccessUseCase";
import { HandlePaymentFailureUseCase } from "./use-cases/handle-payment-failure-use-case/HandlePaymentFailureUseCase";

export class ExpedientPaymentSubscriber {
  private readonly handlePaymentSuccessUseCase: HandlePaymentSuccessUseCase;
  private readonly handlePaymentFailureUseCase: HandlePaymentFailureUseCase;

  constructor(private readonly eventBus: EventBus, expedientsRepository: ExpedientsRepository) {
    this.handlePaymentSuccessUseCase = new HandlePaymentSuccessUseCase(expedientsRepository, eventBus);
    this.handlePaymentFailureUseCase = new HandlePaymentFailureUseCase(expedientsRepository, eventBus);
    this.subscribeToPaymentEvents();
  }

  private subscribeToPaymentEvents(): void {
    // Subscribe to payment success event
    this.eventBus.subscribe("payment.success", async (payload: { expedientId: string; transactionId?: string }) => {
      try {
        await this.handlePaymentSuccessUseCase.execute(payload.expedientId);
      } catch (error) {
        console.error(`[EXPEDIENT PAYMENT] Error handling payment success:`, error);
      }
    });

    // Subscribe to payment failure event
    this.eventBus.subscribe("payment.failure", async (payload: { expedientId: string; errorMessage?: string }) => {
      try {
        await this.handlePaymentFailureUseCase.execute(payload.expedientId);
      } catch (error) {
        console.error(`[EXPEDIENT PAYMENT] Error handling payment failure:`, error);
      }
    });
  }
}
