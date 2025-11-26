export class UpdateExpedientInputDto {
  public readonly id: string;
  public readonly title?: string;
  public readonly description?: string;
  public readonly completed?: boolean;

  constructor(params: { id: string }, body: { title?: string; description?: string; completed?: boolean }) {
    this.validate(params, body);
    this.id = params.id;
    this.title = body.title;
    this.description = body.description;
    this.completed = body.completed;
  }

  private validate(params: { id: string }, body: { title?: string; description?: string; completed?: boolean }) {
    if (!params.id) {
      throw new Error("Id is required");
    }
    // At least one field should be provided for update
    if (!body.title && !body.description && body.completed === undefined) {
      throw new Error("At least one field (title, description, or completed) must be provided for update");
    }
  }
}
