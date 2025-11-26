import { ExpedientsRepository } from "../../models/ExpedientsRepository";
import { ExpedientResponseDto } from "../_shared/TodoResponseDto";

export class GetAllExpedientsUseCase {
  constructor(private readonly todosRepository: ExpedientsRepository) {}

  async execute(): Promise<ExpedientResponseDto[]> {
    const expedients = await this.todosRepository.findAll();
    return expedients.map((expedient) => new ExpedientResponseDto(expedient));
  }
}
