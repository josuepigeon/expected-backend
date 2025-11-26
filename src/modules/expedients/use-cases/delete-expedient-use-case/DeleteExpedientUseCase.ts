import { ExpedientsRepository } from "../../models/ExpedientsRepository";
import { EventBus } from "../../../_shared/models/EventBus";

export class DeleteExpedientUseCase {
  constructor(private readonly todosRepository: ExpedientsRepository, private readonly eventBus: EventBus) {}

  async execute(id: string): Promise<void> {
    const expedient = await this.todosRepository.findById(id);
    if (!expedient) {
      throw new Error("Expedient not found");
    }

    await this.todosRepository.delete(id);

    await this.eventBus.publish("expedient.deleted", expedient.toPrimitives());
  }
}
