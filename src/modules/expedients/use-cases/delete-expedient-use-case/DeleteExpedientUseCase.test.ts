import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeleteExpedientUseCase } from "./DeleteExpedientUseCase";
import { ExpedientsRepository } from "../../models/ExpedientsRepository";
import { EventBus } from "../../../_shared/models/EventBus";
import { Expedient } from "../../models/Expedient";

describe("DeleteExpedientUseCase", () => {
  let useCase: DeleteExpedientUseCase;
  let mockRepository: ExpedientsRepository;
  let mockEventBus: EventBus;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    mockEventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn(),
    };

    useCase = new DeleteExpedientUseCase(mockRepository, mockEventBus);
  });

  it("should delete expedient successfully", async () => {
    const expedient = Expedient.new("Test Title", "Test Description");
    vi.mocked(mockRepository.findById).mockResolvedValue(expedient);

    await useCase.execute(expedient.id);

    expect(mockRepository.findById).toHaveBeenCalledWith(expedient.id);
    expect(mockRepository.delete).toHaveBeenCalledWith(expedient.id);
    expect(mockEventBus.publish).toHaveBeenCalledWith("expedient.deleted", expect.any(Object));
  });

  it("should throw error when expedient not found", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow("Expedient not found");
    expect(mockRepository.delete).not.toHaveBeenCalled();
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });

  it("should publish event with correct payload", async () => {
    const expedient = Expedient.new("Test Title", "Test Description");
    vi.mocked(mockRepository.findById).mockResolvedValue(expedient);

    await useCase.execute(expedient.id);

    expect(mockEventBus.publish).toHaveBeenCalledWith(
      "expedient.deleted",
      expect.objectContaining({
        id: expedient.id,
        title: "Test Title",
        description: "Test Description",
      })
    );
  });
});
