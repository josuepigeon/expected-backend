export interface PaymentService {
  processPayment(amount: number, currency: string, paymentMethod: PaymentMethod): Promise<PaymentResult>;
}

export interface PaymentMethod {
  type: "credit_card" | "debit_card" | "bank_transfer";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  accountNumber?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}
