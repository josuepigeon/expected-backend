import { EventBus } from "../models/EventBus";
import { EventEmitter } from "events";

export class EventBusImplementation implements EventBus {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  publish(eventName: string, payload: any): Promise<void> {
    console.log(`Event ${eventName} published with payload ${JSON.stringify(payload, null, 2)}`);
    this.eventEmitter.emit(eventName, payload);
    return Promise.resolve();
  }

  subscribe(eventName: string, callback: (payload: any) => void): void {
    this.eventEmitter.on(eventName, callback);
    this.eventEmitter.prependListener(eventName, (payload: any) => {
      console.log(`RECEIVED EVENT: ${eventName} - Payload: ${JSON.stringify(payload, null, 2)}`);
    });
  }
}
