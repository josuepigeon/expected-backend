import { PaymentService } from "../../models/PaymentService";
import { ExpedientsRepository } from "../../../expedients/models/ExpedientsRepository";
import { PayExpedientInputDto } from "./PayExpedientInputDto";
import { EventBus } from "../../../_shared/models/EventBus";

export class PayExpedientUseCase {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly expedientsRepository: ExpedientsRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(
    input: PayExpedientInputDto
  ): Promise<{ success: boolean; transactionId?: string; errorMessage?: string }> {
    // Verify expedient exists
    const expedient = await this.expedientsRepository.findById(input.expedientId);
    if (!expedient) {
      throw new Error("Expedient not found");
    }

    // Process payment through external API
    const paymentResult = await this.paymentService.processPayment(input.amount, input.currency, input.paymentMethod);

    // Emit payment event based on result
    if (paymentResult.success) {
      await this.eventBus.publish("payment.success", {
        expedientId: input.expedientId,
        amount: input.amount,
        currency: input.currency,
        transactionId: paymentResult.transactionId,
      });
    } else {
      await this.eventBus.publish("payment.failure", {
        expedientId: input.expedientId,
        amount: input.amount,
        currency: input.currency,
        errorMessage: paymentResult.errorMessage,
      });
    }

    return {
      success: paymentResult.success,
      transactionId: paymentResult.transactionId,
      errorMessage: paymentResult.errorMessage,
    };
  }
}
