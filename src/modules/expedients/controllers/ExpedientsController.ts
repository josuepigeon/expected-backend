import { Router, Request, Response } from "express";
import { CreateExpedientUseCase } from "../use-cases/create-expedient-use-case/CreateExpedientUseCase";
import { GetExpedientByIdUseCase } from "../use-cases/get-expedient-by-id-use-case/GetExpedientByIdUseCase";
import { UpdateExpedientUseCase } from "../use-cases/update-expedient-use-case/UpdateExpedientUseCase";
import { DeleteExpedientUseCase } from "../use-cases/delete-expedient-use-case/DeleteExpedientUseCase";
import { GetAllExpedientsUseCase } from "../use-cases/get-all-expedients-use-case/GetAllExpedientsUseCase";
import { CreateExpedientInputDto } from "../use-cases/create-expedient-use-case/CreateExpedientInputDto";
import { UpdateExpedientInputDto } from "../use-cases/update-expedient-use-case/UpdateExpedientInputDto";
import { EventBus } from "../../_shared/models/EventBus";
import { ExpedientsRepository } from "../models/ExpedientsRepository";
export class ExpedientsController {
  public readonly router: Router;

  private readonly createExpedientUseCase: CreateExpedientUseCase;
  private readonly getExpedientByIdUseCase: GetExpedientByIdUseCase;
  private readonly updateExpedientUseCase: UpdateExpedientUseCase;
  private readonly deleteExpedientUseCase: DeleteExpedientUseCase;
  private readonly getAllExpedientsUseCase: GetAllExpedientsUseCase;

  constructor(expedientsRepository: ExpedientsRepository, eventBus: EventBus) {
    this.router = Router();

    this.router.get("/expedients", this.getExpedients.bind(this));
    this.router.get("/expedients/:id", this.getExpedientById.bind(this));
    this.router.post("/expedients", this.postExpedient.bind(this));
    this.router.put("/expedients/:id", this.putExpedient.bind(this));
    this.router.delete("/expedients/:id", this.deleteExpedient.bind(this));

    this.createExpedientUseCase = new CreateExpedientUseCase(expedientsRepository, eventBus);
    this.getExpedientByIdUseCase = new GetExpedientByIdUseCase(expedientsRepository);
    this.updateExpedientUseCase = new UpdateExpedientUseCase(expedientsRepository, eventBus);
    this.deleteExpedientUseCase = new DeleteExpedientUseCase(expedientsRepository, eventBus);
    this.getAllExpedientsUseCase = new GetAllExpedientsUseCase(expedientsRepository);
  }

  private async getExpedients(req: Request, res: Response) {
    try {
      const expedients = await this.getAllExpedientsUseCase.execute();
      res.status(200).json(expedients.map((e) => e.toPrimitives()));
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private async getExpedientById(req: Request, res: Response) {
    try {
      const expedient = await this.getExpedientByIdUseCase.execute(req.params.id);
      res.status(200).json(expedient.toPrimitives());
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private async postExpedient(req: Request, res: Response) {
    try {
      const input = new CreateExpedientInputDto(req.body);
      const expedient = await this.createExpedientUseCase.execute(input);
      res.status(201).json(expedient.toPrimitives());
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private async putExpedient(req: Request, res: Response) {
    try {
      const input = new UpdateExpedientInputDto({ id: req.params.id }, req.body);
      const expedient = await this.updateExpedientUseCase.execute(input);
      res.status(200).json(expedient.toPrimitives());
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private async deleteExpedient(req: Request, res: Response) {
    try {
      await this.deleteExpedientUseCase.execute(req.params.id);
      res.status(200).json({ message: "Expedient deleted successfully" });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
  }
}
