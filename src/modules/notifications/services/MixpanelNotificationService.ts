import { NotificationService } from "../models/NotificationService";

export class MixpanelNotificationService implements NotificationService {
  private apiKey: string;
  private projectToken: string;

  constructor(apiKey: string, projectToken: string) {
    this.apiKey = apiKey;
    this.projectToken = projectToken;
  }

  async send(eventName: string, payload: any): Promise<void> {
    // In a real implementation, this would send events to Mixpanel API
    // For now, we'll just log to showcase the process
    console.log(`[MIXPANEL] Sending event to Mixpanel (Project: ${this.projectToken})`);
    console.log(`[MIXPANEL] Event: ${eventName}`);
    console.log(`[MIXPANEL] Properties:`, JSON.stringify(payload, null, 2));

    // Mock implementation - would be something like:
    // const event = {
    //   event: eventName,
    //   properties: {
    //     token: this.projectToken,
    //     distinct_id: payload.id || 'anonymous',
    //     ...payload
    //   }
    // };
    // await fetch('https://api.mixpanel.com/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify([event])
    // });

    return Promise.resolve();
  }
}
