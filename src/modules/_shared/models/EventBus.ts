export interface EventBus {
  publish(eventName: string, payload: any): Promise<void>;
  subscribe(eventName: string, callback: (payload: any) => void): void;
}
