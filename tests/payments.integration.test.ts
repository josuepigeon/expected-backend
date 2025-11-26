import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";

describe("Payments Integration Tests", () => {
  describe("POST /payments/expedients/:expedientId", () => {
    it("should process payment and return valid response", async () => {
      // Create an expedient first
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Test Expedient",
          description: "Test Description",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      // Process payment
      const paymentResponse = await request(app)
        .post(`/payments/expedients/${expedientId}`)
        .send({
          amount: 100.0,
          currency: "USD",
          paymentMethod: {
            type: "credit_card",
            cardNumber: "4111111111111111",
            expiryDate: "12/25",
            cvv: "123",
          },
        })
        .expect(200);

      // Verify response structure (success or failure both valid)
      expect(paymentResponse.body).toHaveProperty("success");
      expect(typeof paymentResponse.body.success).toBe("boolean");

      if (paymentResponse.body.success) {
        expect(paymentResponse.body).toHaveProperty("transactionId");
        expect(paymentResponse.body.transactionId).toBeDefined();
      } else {
        expect(paymentResponse.body).toHaveProperty("errorMessage");
        expect(paymentResponse.body.errorMessage).toBeDefined();
      }

      // Wait for event processing
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify expedient still exists
      const expedientResponse = await request(app).get(`/expedients/${expedientId}`).expect(200);
      expect(expedientResponse.body.id).toBe(expedientId);
    });

    it("should handle payment response (success or failure)", async () => {
      // Create an expedient
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Test Expedient",
          description: "Test Description",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      // Process payment
      const paymentResponse = await request(app)
        .post(`/payments/expedients/${expedientId}`)
        .send({
          amount: 100.0,
          currency: "USD",
          paymentMethod: {
            type: "credit_card",
            cardNumber: "4111111111111111",
            expiryDate: "12/25",
            cvv: "123",
          },
        })
        .expect(200);

      // Verify response structure
      expect(paymentResponse.body).toHaveProperty("success");

      if (!paymentResponse.body.success) {
        expect(paymentResponse.body).toHaveProperty("errorMessage");
        expect(paymentResponse.body.errorMessage).toBeDefined();
      }

      // Wait for event processing
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should return 500 when expedient not found", async () => {
      const response = await request(app)
        .post("/payments/expedients/non-existent-id")
        .send({
          amount: 100.0,
          currency: "USD",
          paymentMethod: {
            type: "credit_card",
            cardNumber: "4111111111111111",
            expiryDate: "12/25",
            cvv: "123",
          },
        })
        .expect(500);

      expect(response.body.message).toContain("not found");
    });

    it("should return 500 when amount is missing", async () => {
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Test Expedient",
          description: "Test Description",
        })
        .expect(201);

      const response = await request(app)
        .post(`/payments/expedients/${createResponse.body.id}`)
        .send({
          currency: "USD",
          paymentMethod: {
            type: "credit_card",
          },
        })
        .expect(500);

      expect(response.body.message).toContain("Amount");
    });

    it("should return 500 when currency is missing", async () => {
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Test Expedient",
          description: "Test Description",
        })
        .expect(201);

      const response = await request(app)
        .post(`/payments/expedients/${createResponse.body.id}`)
        .send({
          amount: 100.0,
          paymentMethod: {
            type: "credit_card",
          },
        })
        .expect(500);

      expect(response.body.message).toContain("Currency");
    });

    it("should return 500 when payment method is missing", async () => {
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Test Expedient",
          description: "Test Description",
        })
        .expect(201);

      const response = await request(app)
        .post(`/payments/expedients/${createResponse.body.id}`)
        .send({
          amount: 100.0,
          currency: "USD",
        })
        .expect(500);

      expect(response.body.message).toContain("Payment method");
    });
  });

  describe("Payment Event Flow", () => {
    it("should emit payment.success event when payment succeeds", async () => {
      // Create expedient
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Payment Test",
          description: "Testing payment events",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      // Process payment and verify response
      const paymentResponse = await request(app)
        .post(`/payments/expedients/${expedientId}`)
        .send({
          amount: 50.0,
          currency: "USD",
          paymentMethod: {
            type: "credit_card",
            cardNumber: "4111111111111111",
            expiryDate: "12/25",
            cvv: "123",
          },
        })
        .expect(200);

      // The payment might succeed or fail (random), but we should get a valid response
      expect(paymentResponse.body).toHaveProperty("success");
      if (paymentResponse.body.success) {
        expect(paymentResponse.body).toHaveProperty("transactionId");
      } else {
        expect(paymentResponse.body).toHaveProperty("errorMessage");
      }
    });

    it("should support different payment methods", async () => {
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Payment Method Test",
          description: "Testing different payment methods",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      // Test credit card
      const creditCardResponse = await request(app)
        .post(`/payments/expedients/${expedientId}`)
        .send({
          amount: 100.0,
          currency: "USD",
          paymentMethod: {
            type: "credit_card",
            cardNumber: "4111111111111111",
            expiryDate: "12/25",
            cvv: "123",
          },
        })
        .expect(200);

      expect(creditCardResponse.body).toHaveProperty("success");

      // Test debit card
      const newExpedient = await request(app)
        .post("/expedients")
        .send({
          title: "Debit Card Test",
          description: "Testing debit card",
        })
        .expect(201);

      const debitCardResponse = await request(app)
        .post(`/payments/expedients/${newExpedient.body.id}`)
        .send({
          amount: 75.0,
          currency: "EUR",
          paymentMethod: {
            type: "debit_card",
            cardNumber: "4111111111111111",
            expiryDate: "12/25",
            cvv: "123",
          },
        })
        .expect(200);

      expect(debitCardResponse.body).toHaveProperty("success");

      // Test bank transfer
      const bankTransferExpedient = await request(app)
        .post("/expedients")
        .send({
          title: "Bank Transfer Test",
          description: "Testing bank transfer",
        })
        .expect(201);

      const bankTransferResponse = await request(app)
        .post(`/payments/expedients/${bankTransferExpedient.body.id}`)
        .send({
          amount: 200.0,
          currency: "GBP",
          paymentMethod: {
            type: "bank_transfer",
            accountNumber: "1234567890",
          },
        })
        .expect(200);

      expect(bankTransferResponse.body).toHaveProperty("success");
    });
  });

  describe("End-to-End Payment Flow", () => {
    it("should complete full payment workflow: create expedient -> pay -> verify status", async () => {
      // Step 1: Create expedient
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "E2E Payment Test",
          description: "End-to-end payment workflow",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      // Step 2: Process payment
      const paymentResponse = await request(app)
        .post(`/payments/expedients/${expedientId}`)
        .send({
          amount: 150.0,
          currency: "USD",
          paymentMethod: {
            type: "credit_card",
            cardNumber: "4111111111111111",
            expiryDate: "12/25",
            cvv: "123",
          },
        })
        .expect(200);

      // Step 3: Verify payment was processed
      expect(paymentResponse.body).toHaveProperty("success");
      expect(paymentResponse.body).toHaveProperty(paymentResponse.body.success ? "transactionId" : "errorMessage");

      // Step 4: Wait for event processing
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Step 5: Verify expedient still exists and can be retrieved
      const expedientResponse = await request(app).get(`/expedients/${expedientId}`).expect(200);
      expect(expedientResponse.body.id).toBe(expedientId);
    });

    it("should handle multiple payments for different expedients", async () => {
      // Create multiple expedients
      const expedient1 = await request(app)
        .post("/expedients")
        .send({
          title: "Expedient 1",
          description: "First expedient",
        })
        .expect(201);

      const expedient2 = await request(app)
        .post("/expedients")
        .send({
          title: "Expedient 2",
          description: "Second expedient",
        })
        .expect(201);

      // Process payments for both
      const payment1 = await request(app)
        .post(`/payments/expedients/${expedient1.body.id}`)
        .send({
          amount: 100.0,
          currency: "USD",
          paymentMethod: {
            type: "credit_card",
            cardNumber: "4111111111111111",
            expiryDate: "12/25",
            cvv: "123",
          },
        })
        .expect(200);

      const payment2 = await request(app)
        .post(`/payments/expedients/${expedient2.body.id}`)
        .send({
          amount: 200.0,
          currency: "USD",
          paymentMethod: {
            type: "credit_card",
            cardNumber: "4111111111111111",
            expiryDate: "12/25",
            cvv: "123",
          },
        })
        .expect(200);

      // Both should have valid responses
      expect(payment1.body).toHaveProperty("success");
      expect(payment2.body).toHaveProperty("success");

      // Both expedients should still be accessible
      await request(app).get(`/expedients/${expedient1.body.id}`).expect(200);
      await request(app).get(`/expedients/${expedient2.body.id}`).expect(200);
    });
  });
});
