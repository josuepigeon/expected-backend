import { EventBus } from "../_shared/models/EventBus";
import { NotificationService } from "./models/NotificationService";

export class NotificationSubscriber {
  private notificationServices: NotificationService[];

  constructor(eventBus: EventBus, notificationServices: NotificationService[]) {
    this.notificationServices = notificationServices;
    this.subscribeToEvents(eventBus);
  }

  private subscribeToEvents(eventBus: EventBus): void {
    // Subscribe to expedient-related events
    const events = ["expedient.created", "expedient.updated", "expedient.deleted"];

    events.forEach((eventName) => {
      eventBus.subscribe(eventName, async (payload: any) => {
        await this.notifyAllServices(eventName, payload);
      });
    });
  }

  private async notifyAllServices(eventName: string, payload: any): Promise<void> {
    const promises = this.notificationServices.map((service) => service.send(eventName, payload));
    await Promise.allSettled(promises);
  }
}
