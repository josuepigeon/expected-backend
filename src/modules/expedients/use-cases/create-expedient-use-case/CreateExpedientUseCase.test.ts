import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateExpedientUseCase } from "./CreateExpedientUseCase";
import { CreateExpedientInputDto } from "./CreateExpedientInputDto";
import { ExpedientsRepository } from "../../models/ExpedientsRepository";
import { EventBus } from "../../../_shared/models/EventBus";
import { Expedient } from "../../models/Expedient";

describe("CreateExpedientUseCase", () => {
  let useCase: CreateExpedientUseCase;
  let mockRepository: ExpedientsRepository;
  let mockEventBus: EventBus;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
    };

    mockEventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn(),
    };

    useCase = new CreateExpedientUseCase(mockRepository, mockEventBus);
  });

  it("should create an expedient successfully", async () => {
    const input = new CreateExpedientInputDto({
      title: "Test Title",
      description: "Test Description",
    });

    const result = await useCase.execute(input);

    expect(mockRepository.save).toHaveBeenCalledOnce();
    expect(mockEventBus.publish).toHaveBeenCalledWith("expedient.created", expect.any(Object));
    expect(result).toBeInstanceOf(Object);
    expect(result.expedient.title).toBe("Test Title");
    expect(result.expedient.description).toBe("Test Description");
    expect(result.expedient.completed).toBe(false);
  });

  it("should throw error if title is missing", () => {
    expect(() => {
      new CreateExpedientInputDto({
        title: "",
        description: "Test Description",
      });
    }).toThrow("Title and description are required");
  });

  it("should throw error if description is missing", () => {
    expect(() => {
      new CreateExpedientInputDto({
        title: "Test Title",
        description: "",
      });
    }).toThrow("Title and description are required");
  });

  it("should publish event with correct payload", async () => {
    const input = new CreateExpedientInputDto({
      title: "Test Title",
      description: "Test Description",
    });

    await useCase.execute(input);

    expect(mockEventBus.publish).toHaveBeenCalledWith(
      "expedient.created",
      expect.objectContaining({
        title: "Test Title",
        description: "Test Description",
        completed: false,
      })
    );
  });
});
