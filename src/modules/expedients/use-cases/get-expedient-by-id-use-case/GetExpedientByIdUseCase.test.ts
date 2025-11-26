import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetExpedientByIdUseCase } from "./GetExpedientByIdUseCase";
import { ExpedientsRepository } from "../../models/ExpedientsRepository";
import { Expedient } from "../../models/Expedient";

describe("GetExpedientByIdUseCase", () => {
  let useCase: GetExpedientByIdUseCase;
  let mockRepository: ExpedientsRepository;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
    };

    useCase = new GetExpedientByIdUseCase(mockRepository);
  });

  it("should return expedient when found", async () => {
    const expedient = Expedient.new("Test Title", "Test Description");
    vi.mocked(mockRepository.findById).mockResolvedValue(expedient);

    const result = await useCase.execute(expedient.id);

    expect(mockRepository.findById).toHaveBeenCalledWith(expedient.id);
    expect(result).toBeInstanceOf(Object);
    expect(result.expedient.id).toBe(expedient.id);
    expect(result.expedient.title).toBe("Test Title");
    expect(result.expedient.description).toBe("Test Description");
  });

  it("should throw error when expedient not found", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow("Todo not found");
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });
});
