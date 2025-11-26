export class PayExpedientInputDto {
  public readonly expedientId: string;
  public readonly amount: number;
  public readonly currency: string;
  public readonly paymentMethod: {
    type: "credit_card" | "debit_card" | "bank_transfer";
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    accountNumber?: string;
  };

  constructor(params: { expedientId: string }, body: { amount: number; currency: string; paymentMethod: any }) {
    this.validate(params, body);
    this.expedientId = params.expedientId;
    this.amount = body.amount;
    this.currency = body.currency;
    this.paymentMethod = body.paymentMethod;
  }

  private validate(params: { expedientId: string }, body: { amount: number; currency: string; paymentMethod: any }) {
    if (!params.expedientId) {
      throw new Error("Expedient ID is required");
    }
    if (!body.amount || body.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    if (!body.currency) {
      throw new Error("Currency is required");
    }
    if (!body.paymentMethod || !body.paymentMethod.type) {
      throw new Error("Payment method is required");
    }
  }
}
