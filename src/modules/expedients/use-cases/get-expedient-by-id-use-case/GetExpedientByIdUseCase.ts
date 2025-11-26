import { ExpedientsRepository } from "../../models/ExpedientsRepository";
import { ExpedientResponseDto } from "../_shared/TodoResponseDto";

export class GetExpedientByIdUseCase {
  constructor(private readonly todosRepository: ExpedientsRepository) {}

  async execute(id: string): Promise<ExpedientResponseDto> {
    const todo = await this.todosRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    return new ExpedientResponseDto(todo);
  }
}
