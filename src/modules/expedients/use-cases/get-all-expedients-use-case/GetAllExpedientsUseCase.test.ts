import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetAllExpedientsUseCase } from "./GetAllExpedientsUseCase";
import { ExpedientsRepository } from "../../models/ExpedientsRepository";
import { Expedient } from "../../models/Expedient";

describe("GetAllExpedientsUseCase", () => {
  let useCase: GetAllExpedientsUseCase;
  let mockRepository: ExpedientsRepository;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
    };

    useCase = new GetAllExpedientsUseCase(mockRepository);
  });

  it("should return all expedients", async () => {
    const expedient1 = Expedient.new("Title 1", "Description 1");
    const expedient2 = Expedient.new("Title 2", "Description 2");
    vi.mocked(mockRepository.findAll).mockResolvedValue([expedient1, expedient2]);

    const result = await useCase.execute();

    expect(mockRepository.findAll).toHaveBeenCalledOnce();
    expect(result).toHaveLength(2);
    expect(result[0].expedient.id).toBe(expedient1.id);
    expect(result[1].expedient.id).toBe(expedient2.id);
  });

  it("should return empty array when no expedients exist", async () => {
    vi.mocked(mockRepository.findAll).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
    expect(mockRepository.findAll).toHaveBeenCalledOnce();
  });
});
