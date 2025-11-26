import { describe, it, expect, beforeEach, vi } from "vitest";
import { Expedient } from "./Expedient";
import { ExpedientStatus } from "./ExpedientStatus";

describe("Expedient", () => {
  describe("static new()", () => {
    it("should create a new expedient with valid title and description", () => {
      const expedient = Expedient.new("Test Title", "Test Description");

      expect(expedient).toBeInstanceOf(Expedient);
      expect(expedient.title).toBe("Test Title");
      expect(expedient.description).toBe("Test Description");
      expect(expedient.completed).toBe(false);
      expect(expedient.id).toBeDefined();
      expect(expedient.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(expedient.createdAt).toBeInstanceOf(Date);
      expect(expedient.updatedAt).toBeInstanceOf(Date);
    });

    it("should throw error if title is empty", () => {
      expect(() => {
        Expedient.new("", "Test Description");
      }).toThrow("Title and description are required");
    });

    it("should throw error if title is missing", () => {
      expect(() => {
        Expedient.new(null as any, "Test Description");
      }).toThrow("Title and description are required");
    });

    it("should throw error if description is empty", () => {
      expect(() => {
        Expedient.new("Test Title", "");
      }).toThrow("Title and description are required");
    });

    it("should throw error if description is missing", () => {
      expect(() => {
        Expedient.new("Test Title", null as any);
      }).toThrow("Title and description are required");
    });

    it("should generate unique IDs for different expedients", () => {
      const expedient1 = Expedient.new("Title 1", "Description 1");
      const expedient2 = Expedient.new("Title 2", "Description 2");

      expect(expedient1.id).not.toBe(expedient2.id);
    });

    it("should set createdAt and updatedAt to current date", () => {
      const beforeCreation = new Date();
      const expedient = Expedient.new("Test Title", "Test Description");
      const afterCreation = new Date();

      expect(expedient.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(expedient.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
      expect(expedient.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(expedient.updatedAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });
  });

  describe("constructor", () => {
    it("should initialize all properties correctly", () => {
      const id = "test-id";
      const title = "Test Title";
      const description = "Test Description";
      const completed = true;
      const createdAt = new Date("2023-01-01");
      const updatedAt = new Date("2023-01-02");

      const expedient = new Expedient(id, title, description, completed, createdAt, updatedAt, ExpedientStatus.CREATED);

      expect(expedient.id).toBe(id);
      expect(expedient.title).toBe(title);
      expect(expedient.description).toBe(description);
      expect(expedient.completed).toBe(completed);
      expect(expedient.createdAt).toBe(createdAt);
      expect(expedient.updatedAt).toBe(updatedAt);
      expect(expedient.status).toBe(ExpedientStatus.CREATED);
    });
  });

  describe("complete()", () => {
    it("should set completed to true", () => {
      const expedient = Expedient.new("Test Title", "Test Description");
      expect(expedient.completed).toBe(false);

      expedient.complete();

      expect(expedient.completed).toBe(true);
    });

    it("should update updatedAt timestamp", () => {
      const expedient = Expedient.new("Test Title", "Test Description");
      const originalUpdatedAt = expedient.updatedAt;

      // Wait a bit to ensure timestamp difference
      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);

      expedient.complete();

      expect(expedient.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      vi.useRealTimers();
    });

    it("should be idempotent - can be called multiple times", () => {
      const expedient = Expedient.new("Test Title", "Test Description");

      expedient.complete();
      expect(expedient.completed).toBe(true);

      expedient.complete();
      expect(expedient.completed).toBe(true);
    });
  });

  describe("uncomplete()", () => {
    it("should set completed to false if currently completed", () => {
      const expedient = Expedient.new("Test Title", "Test Description");
      expedient.complete();
      expect(expedient.completed).toBe(true);

      expedient.uncomplete();

      expect(expedient.completed).toBe(false);
    });

    it("should throw error if expedient is not completed", () => {
      const expedient = Expedient.new("Test Title", "Test Description");
      expect(expedient.completed).toBe(false);

      expect(() => {
        expedient.uncomplete();
      }).toThrow("Todo is not completed");
    });

    it("should update updatedAt timestamp", () => {
      const expedient = Expedient.new("Test Title", "Test Description");
      expedient.complete();
      const originalUpdatedAt = expedient.updatedAt;

      // Wait a bit to ensure timestamp difference
      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);

      expedient.uncomplete();

      expect(expedient.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      vi.useRealTimers();
    });
  });

  describe("update()", () => {
    it("should create a new Expedient instance with updated title", () => {
      const original = Expedient.new("Original Title", "Original Description");
      const updated = original.update("Updated Title");

      expect(updated).not.toBe(original);
      expect(updated).toBeInstanceOf(Expedient);
      expect(updated.title).toBe("Updated Title");
      expect(updated.description).toBe("Original Description");
      expect(updated.completed).toBe(false);
    });

    it("should create a new Expedient instance with updated description", () => {
      const original = Expedient.new("Original Title", "Original Description");
      const updated = original.update(undefined, "Updated Description");

      expect(updated).not.toBe(original);
      expect(updated.title).toBe("Original Title");
      expect(updated.description).toBe("Updated Description");
      expect(updated.completed).toBe(false);
    });

    it("should create a new Expedient instance with updated completed status", () => {
      const original = Expedient.new("Original Title", "Original Description");
      const updated = original.update(undefined, undefined, true);

      expect(updated).not.toBe(original);
      expect(updated.title).toBe("Original Title");
      expect(updated.description).toBe("Original Description");
      expect(updated.completed).toBe(true);
    });

    it("should update all fields when provided", () => {
      const original = Expedient.new("Original Title", "Original Description");
      const updated = original.update("New Title", "New Description", true);

      expect(updated.title).toBe("New Title");
      expect(updated.description).toBe("New Description");
      expect(updated.completed).toBe(true);
    });

    it("should preserve id and createdAt", () => {
      const original = Expedient.new("Original Title", "Original Description");
      const originalId = original.id;
      const originalCreatedAt = original.createdAt;

      const updated = original.update("New Title");

      expect(updated.id).toBe(originalId);
      expect(updated.createdAt).toBe(originalCreatedAt);
    });

    it("should update updatedAt timestamp", () => {
      const original = Expedient.new("Original Title", "Original Description");
      const originalUpdatedAt = original.updatedAt;

      // Wait a bit to ensure timestamp difference
      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);

      const updated = original.update("New Title");

      expect(updated.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      vi.useRealTimers();
    });

    it("should not modify the original expedient", () => {
      const original = Expedient.new("Original Title", "Original Description");
      const originalTitle = original.title;
      const originalDescription = original.description;

      original.update("New Title", "New Description", true);

      expect(original.title).toBe(originalTitle);
      expect(original.description).toBe(originalDescription);
      expect(original.completed).toBe(false);
    });
  });

  describe("toPrimitives()", () => {
    it("should return object with all properties", () => {
      const expedient = Expedient.new("Test Title", "Test Description");
      const primitives = expedient.toPrimitives();

      expect(primitives).toEqual({
        id: expedient.id,
        title: "Test Title",
        description: "Test Description",
        completed: false,
        createdAt: expedient.createdAt,
        updatedAt: expedient.updatedAt,
      });
    });

    it("should return updated values after modifications", () => {
      const expedient = Expedient.new("Original Title", "Original Description");
      expedient.complete();

      const primitives = expedient.toPrimitives();

      expect(primitives.completed).toBe(true);
      expect(primitives.title).toBe("Original Title");
      expect(primitives.description).toBe("Original Description");
    });

    it("should return Date objects in primitives", () => {
      const expedient = Expedient.new("Test Title", "Test Description");
      const primitives = expedient.toPrimitives();

      expect(primitives.createdAt).toBeInstanceOf(Date);
      expect(primitives.updatedAt).toBeInstanceOf(Date);
    });
  });
});
