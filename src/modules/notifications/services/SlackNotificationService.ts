import { NotificationService } from "../models/NotificationService";

export class SlackNotificationService implements NotificationService {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async send(eventName: string, payload: any): Promise<void> {
    // In a real implementation, this would make an HTTP POST request to Slack webhook
    // For now, we'll just log to showcase the process
    console.log(`[SLACK] Sending notification to ${this.webhookUrl}`);
    console.log(`[SLACK] Event: ${eventName}`);
    console.log(`[SLACK] Payload:`, JSON.stringify(payload, null, 2));

    // Mock implementation - would be something like:
    // await fetch(this.webhookUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     text: `Event: ${eventName}`,
    //     attachments: [{ text: JSON.stringify(payload, null, 2) }]
    //   })
    // });

    return Promise.resolve();
  }
}
