import { Expedient } from "./Expedient";

export interface ExpedientsRepository {
  save(todo: Expedient): Promise<Expedient>;
  findAll(): Promise<Expedient[]>;
  findById(id: string): Promise<Expedient | null>;
  delete(id: string): Promise<void>;
}
