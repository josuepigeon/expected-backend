import { ExpedientsRepository } from "../../models/ExpedientsRepository";
import { UpdateExpedientInputDto } from "./UpdateExpedientInputDto";
import { ExpedientResponseDto } from "../_shared/TodoResponseDto";
import { EventBus } from "../../../_shared/models/EventBus";

export class UpdateExpedientUseCase {
  constructor(private readonly todosRepository: ExpedientsRepository, private readonly eventBus: EventBus) {}

  async execute(input: UpdateExpedientInputDto): Promise<ExpedientResponseDto> {
    const expedient = await this.todosRepository.findById(input.id);
    if (!expedient) {
      throw new Error("Expedient not found");
    }

    const updatedExpedient = expedient.update(input.title, input.description, input.completed);

    await this.todosRepository.save(updatedExpedient);

    await this.eventBus.publish("expedient.updated", updatedExpedient.toPrimitives());

    return new ExpedientResponseDto(updatedExpedient);
  }
}
