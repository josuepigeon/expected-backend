import { Expedient } from "../models/Expedient";
import { ExpedientsRepository } from "../models/ExpedientsRepository";

export class MemoryExpedientsRepository implements ExpedientsRepository {
  private expedients: Expedient[] = [];

  save(expedient: Expedient): Promise<Expedient> {
    const existingIndex = this.expedients.findIndex((e) => e.id === expedient.id);
    if (existingIndex >= 0) {
      this.expedients[existingIndex] = expedient;
    } else {
      this.expedients.push(expedient);
    }
    return Promise.resolve(expedient);
  }

  findAll(): Promise<Expedient[]> {
    return Promise.resolve(this.expedients);
  }
  findById(id: string): Promise<Expedient | null> {
    return Promise.resolve(this.expedients.find((expedient) => expedient.id === id) || null);
  }
  delete(id: string): Promise<void> {
    this.expedients = this.expedients.filter((expedient) => expedient.id !== id);
    return Promise.resolve();
  }
}
