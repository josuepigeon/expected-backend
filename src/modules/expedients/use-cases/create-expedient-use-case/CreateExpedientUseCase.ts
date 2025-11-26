import { Expedient } from "../../models/Expedient";
import { ExpedientsRepository } from "../../models/ExpedientsRepository";
import { CreateExpedientInputDto } from "./CreateExpedientInputDto";
import { ExpedientResponseDto } from "../_shared/TodoResponseDto";
import { EventBus } from "../../../_shared/models/EventBus";

export class CreateExpedientUseCase {
  constructor(private readonly todosRepository: ExpedientsRepository, private readonly eventBus: EventBus) {}

  async execute(input: CreateExpedientInputDto): Promise<ExpedientResponseDto> {
    const todo = Expedient.new(input.title, input.description);

    await this.todosRepository.save(todo);

    await this.eventBus.publish("expedient.created", todo.toPrimitives());

    return new ExpedientResponseDto(todo);
  }
}
