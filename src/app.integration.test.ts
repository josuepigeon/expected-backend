import request from "supertest";
import app from "../src/app";
import { describe, it, expect } from "vitest";
describe("API Integration Tests", () => {
  describe("GET /expedients", () => {
    it("should return empty array when no expedients exist", async () => {
      const response = await request(app).get("/expedients").expect(200);

      expect(response.body).toEqual([]);
    });

    it("should return all expedients", async () => {
      // Create expedients through the API
      const expedient1 = await request(app)
        .post("/expedients")
        .send({
          title: "First Expedient",
          description: "First Description",
        })
        .expect(201);

      const expedient2 = await request(app)
        .post("/expedients")
        .send({
          title: "Second Expedient",
          description: "Second Description",
        })
        .expect(201);

      const response = await request(app).get("/expedients").expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expedient1.body.id,
            title: "First Expedient",
            description: "First Description",
            completed: false,
          }),
          expect.objectContaining({
            id: expedient2.body.id,
            title: "Second Expedient",
            description: "Second Description",
            completed: false,
          }),
        ])
      );
    });
  });

  describe("GET /expedients/:id", () => {
    it("should return expedient by id", async () => {
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Test Expedient",
          description: "Test Description",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      const response = await request(app).get(`/expedients/${expedientId}`).expect(200);

      expect(response.body).toEqual({
        id: expedientId,
        title: "Test Expedient",
        description: "Test Description",
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should return 500 when expedient not found", async () => {
      const response = await request(app).get("/expedients/non-existent-id").expect(500);

      expect(response.body).toEqual({
        message: expect.stringContaining("not found"),
      });
    });
  });

  describe("POST /expedients", () => {
    it("should create a new expedient", async () => {
      const response = await request(app)
        .post("/expedients")
        .send({
          title: "New Expedient",
          description: "New Description",
        })
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(String),
        title: "New Expedient",
        description: "New Description",
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      // Verify UUID format
      expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it("should return 500 when title is missing", async () => {
      const response = await request(app)
        .post("/expedients")
        .send({
          description: "Description only",
        })
        .expect(500);

      expect(response.body.message).toContain("required");
    });

    it("should return 500 when description is missing", async () => {
      const response = await request(app)
        .post("/expedients")
        .send({
          title: "Title only",
        })
        .expect(500);

      expect(response.body.message).toContain("required");
    });

    it("should return 500 when both title and description are missing", async () => {
      const response = await request(app).post("/expedients").send({}).expect(500);

      expect(response.body.message).toContain("required");
    });
  });

  describe("PUT /expedients/:id", () => {
    it("should update expedient title", async () => {
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Original Title",
          description: "Original Description",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      const updateResponse = await request(app)
        .put(`/expedients/${expedientId}`)
        .send({
          title: "Updated Title",
        })
        .expect(200);

      expect(updateResponse.body).toEqual({
        id: expedientId,
        title: "Updated Title",
        description: "Original Description",
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      // Verify updatedAt changed
      expect(updateResponse.body.updatedAt).not.toBe(createResponse.body.updatedAt);
    });

    it("should update expedient description", async () => {
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Original Title",
          description: "Original Description",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      const updateResponse = await request(app)
        .put(`/expedients/${expedientId}`)
        .send({
          description: "Updated Description",
        })
        .expect(200);

      expect(updateResponse.body.description).toBe("Updated Description");
      expect(updateResponse.body.title).toBe("Original Title");
    });

    it("should update expedient completed status", async () => {
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Test Title",
          description: "Test Description",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      const updateResponse = await request(app)
        .put(`/expedients/${expedientId}`)
        .send({
          completed: true,
        })
        .expect(200);

      expect(updateResponse.body.completed).toBe(true);
    });

    it("should update all fields when provided", async () => {
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Original Title",
          description: "Original Description",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      const updateResponse = await request(app)
        .put(`/expedients/${expedientId}`)
        .send({
          title: "New Title",
          description: "New Description",
          completed: true,
        })
        .expect(200);

      expect(updateResponse.body).toEqual({
        id: expedientId,
        title: "New Title",
        description: "New Description",
        completed: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should return 500 when expedient not found", async () => {
      const response = await request(app)
        .put("/expedients/non-existent-id")
        .send({
          title: "Updated Title",
        })
        .expect(500);

      expect(response.body.message).toContain("not found");
    });

    it("should return 500 when no update fields provided", async () => {
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Test Title",
          description: "Test Description",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      const response = await request(app).put(`/expedients/${expedientId}`).send({}).expect(500);

      expect(response.body.message).toContain("must be provided");
    });
  });

  describe("DELETE /expedients/:id", () => {
    it("should delete expedient successfully", async () => {
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "To Delete",
          description: "Will be deleted",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/expedients/${expedientId}`).expect(200);

      expect(deleteResponse.body).toEqual({
        message: "Expedient deleted successfully",
      });

      // Verify it's actually deleted
      await request(app).get(`/expedients/${expedientId}`).expect(500);
    });

    it("should return 500 when expedient not found", async () => {
      const response = await request(app).delete("/expedients/non-existent-id").expect(500);

      expect(response.body.message).toContain("not found");
    });
  });

  describe("Full CRUD workflow", () => {
    it("should support complete CRUD operations", async () => {
      // Create
      const createResponse = await request(app)
        .post("/expedients")
        .send({
          title: "Workflow Test",
          description: "Testing full workflow",
        })
        .expect(201);

      const expedientId = createResponse.body.id;

      // Read
      const getResponse = await request(app).get(`/expedients/${expedientId}`).expect(200);
      expect(getResponse.body.title).toBe("Workflow Test");

      // Update
      const updateResponse = await request(app)
        .put(`/expedients/${expedientId}`)
        .send({
          title: "Updated Workflow Test",
          completed: true,
        })
        .expect(200);

      expect(updateResponse.body.title).toBe("Updated Workflow Test");
      expect(updateResponse.body.completed).toBe(true);

      // Verify in list
      const listResponse = await request(app).get("/expedients").expect(200);
      const foundExpedient = listResponse.body.find((e: any) => e.id === expedientId);
      expect(foundExpedient.title).toBe("Updated Workflow Test");
      expect(foundExpedient.completed).toBe(true);

      // Delete
      await request(app).delete(`/expedients/${expedientId}`).expect(200);

      // Verify deletion
      await request(app).get(`/expedients/${expedientId}`).expect(500);
    });
  });
});
