import { ExpedientsRepository } from "../../models/ExpedientsRepository";
import { EventBus } from "../../../_shared/models/EventBus";

export class HandlePaymentSuccessUseCase {
  constructor(private readonly expedientsRepository: ExpedientsRepository, private readonly eventBus: EventBus) {}

  async execute(expedientId: string): Promise<void> {
    const expedient = await this.expedientsRepository.findById(expedientId);
    if (!expedient) {
      throw new Error(`Expedient ${expedientId} not found for payment success`);
    }

    expedient.pay();
    await this.expedientsRepository.save(expedient);

    await this.eventBus.publish("expedient.payment.success", expedient.toPrimitives());
  }
}
