export interface NotificationService {
  send(eventName: string, payload: any): Promise<void>;
}
