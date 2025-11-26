import { Expedient } from "../../models/Expedient";

export class ExpedientResponseDto {
  constructor(public readonly expedient: Expedient) {}

  toPrimitives() {
    return this.expedient.toPrimitives();
  }
}
