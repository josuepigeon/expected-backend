import express from "express";
import { ExpedientsController } from "./modules/expedients/controllers/ExpedientsController";
import { EventBusImplementation } from "./modules/_shared/event-bus/EventBusImplementation";
import { MemoryExpedientsRepository } from "./modules/expedients/repositories/MemoryExpedientsRepository";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const eventBus = new EventBusImplementation();
const expedientsRepository = new MemoryExpedientsRepository();
const expedientsController = new ExpedientsController(expedientsRepository, eventBus);

app.use(expedientsController.router);

export default app;
