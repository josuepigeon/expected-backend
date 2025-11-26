import { describe, it, expect, beforeEach, vi } from "vitest";
import { UpdateExpedientUseCase } from "./UpdateExpedientUseCase";
import { UpdateExpedientInputDto } from "./UpdateExpedientInputDto";
import { ExpedientsRepository } from "../../models/ExpedientsRepository";
import { EventBus } from "../../../_shared/models/EventBus";
import { Expedient } from "../../models/Expedient";

describe("UpdateExpedientUseCase", () => {
  let useCase: UpdateExpedientUseCase;
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

    useCase = new UpdateExpedientUseCase(mockRepository, mockEventBus);
  });

  it("should update expedient successfully", async () => {
    const expedient = Expedient.new("Original Title", "Original Description");
    vi.mocked(mockRepository.findById).mockResolvedValue(expedient);

    const input = new UpdateExpedientInputDto(
      { id: expedient.id },
      { title: "Updated Title", description: "Updated Description" }
    );

    const result = await useCase.execute(input);

    expect(mockRepository.findById).toHaveBeenCalledWith(expedient.id);
    expect(mockRepository.save).toHaveBeenCalledOnce();
    expect(mockEventBus.publish).toHaveBeenCalledWith("expedient.updated", expect.any(Object));
    expect(result.expedient.title).toBe("Updated Title");
    expect(result.expedient.description).toBe("Updated Description");
  });

  it("should update only title when provided", async () => {
    const expedient = Expedient.new("Original Title", "Original Description");
    vi.mocked(mockRepository.findById).mockResolvedValue(expedient);

    const input = new UpdateExpedientInputDto({ id: expedient.id }, { title: "New Title" });

    const result = await useCase.execute(input);

    expect(result.expedient.title).toBe("New Title");
    expect(result.expedient.description).toBe("Original Description");
  });

  it("should update completed status", async () => {
    const expedient = Expedient.new("Test Title", "Test Description");
    vi.mocked(mockRepository.findById).mockResolvedValue(expedient);

    const input = new UpdateExpedientInputDto({ id: expedient.id }, { completed: true });

    const result = await useCase.execute(input);

    expect(result.expedient.completed).toBe(true);
  });

  it("should throw error when expedient not found", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    const input = new UpdateExpedientInputDto({ id: "non-existent-id" }, { title: "New Title" });

    await expect(useCase.execute(input)).rejects.toThrow("Expedient not found");
  });

  it("should throw error when no fields provided for update", () => {
    expect(() => {
      new UpdateExpedientInputDto({ id: "test-id" }, {});
    }).toThrow("At least one field (title, description, or completed) must be provided for update");
  });

  it("should throw error when id is missing", () => {
    expect(() => {
      new UpdateExpedientInputDto({ id: "" }, { title: "New Title" });
    }).toThrow("Id is required");
  });
});
