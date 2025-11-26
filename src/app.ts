import express from "express";
import { ExpedientsController } from "./modules/expedients/controllers/ExpedientsController";
import { EventBusImplementation } from "./modules/_shared/event-bus/EventBusImplementation";
import { MemoryExpedientsRepository } from "./modules/expedients/repositories/MemoryExpedientsRepository";
import { SlackNotificationService } from "./modules/notifications/services/SlackNotificationService";
import { MixpanelNotificationService } from "./modules/notifications/services/MixpanelNotificationService";
import { NotificationSubscriber } from "./modules/notifications/NotificationSubscriber";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const eventBus = new EventBusImplementation();
const expedientsRepository = new MemoryExpedientsRepository();
const expedientsController = new ExpedientsController(expedientsRepository, eventBus);

// Initialize notification services
const slackService = new SlackNotificationService(
  process.env.SLACK_WEBHOOK_URL || "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
);
const mixpanelService = new MixpanelNotificationService(
  process.env.MIXPANEL_API_KEY || "your-mixpanel-api-key",
  process.env.MIXPANEL_PROJECT_TOKEN || "your-mixpanel-project-token"
);

// Subscribe notifications to events
new NotificationSubscriber(eventBus, [slackService, mixpanelService]);

app.use(expedientsController.router);

export default app;
