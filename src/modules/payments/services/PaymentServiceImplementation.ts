import { PaymentService, PaymentMethod, PaymentResult } from "../models/PaymentService";

export class PaymentServiceImplementation implements PaymentService {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async processPayment(amount: number, currency: string, paymentMethod: PaymentMethod): Promise<PaymentResult> {
    // In a real implementation, this would make an HTTP POST request to the payment API
    // For now, we'll mock the behavior to showcase the process
    console.log(`[PAYMENT API] Processing payment to ${this.apiUrl}`);
    console.log(`[PAYMENT API] Amount: ${amount} ${currency}`);
    console.log(`[PAYMENT API] Payment Method: ${paymentMethod.type}`);

    // Mock implementation - would be something like:
    // const response = await fetch(`${this.apiUrl}/payments`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${this.apiKey}`
    //   },
    //   body: JSON.stringify({
    //     amount,
    //     currency,
    //     paymentMethod
    //   })
    // });
    // const result = await response.json();
    // return result;

    // Simulate payment processing with random success/failure for demo
    // In production, this would be based on actual API response
    const simulatedSuccess = Math.random() > 0.3; // 70% success rate for demo

    if (simulatedSuccess) {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`[PAYMENT API] Payment successful. Transaction ID: ${transactionId}`);
      return {
        success: true,
        transactionId,
      };
    } else {
      const errorMessage = "Payment declined. Insufficient funds.";
      console.log(`[PAYMENT API] Payment failed: ${errorMessage}`);
      return {
        success: false,
        errorMessage,
      };
    }
  }
}
