import { Router, Request, Response } from "express";
import { PayExpedientUseCase } from "../use-cases/pay-expedient-use-case/PayExpedientUseCase";
import { PayExpedientInputDto } from "../use-cases/pay-expedient-use-case/PayExpedientInputDto";
import { ExpedientsRepository } from "../../expedients/models/ExpedientsRepository";
import { EventBus } from "../../_shared/models/EventBus";
import { PaymentService } from "../models/PaymentService";

export class PaymentsController {
  public readonly router: Router;

  private readonly payExpedientUseCase: PayExpedientUseCase;

  constructor(paymentService: PaymentService, expedientsRepository: ExpedientsRepository, eventBus: EventBus) {
    this.router = Router();

    this.router.post("/payments/expedients/:expedientId", this.payExpedient.bind(this));

    this.payExpedientUseCase = new PayExpedientUseCase(paymentService, expedientsRepository, eventBus);
  }

  private async payExpedient(req: Request, res: Response) {
    try {
      const input = new PayExpedientInputDto({ expedientId: req.params.expedientId }, req.body);
      const result = await this.payExpedientUseCase.execute(input);
      res.status(200).json(result);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
  }
}
