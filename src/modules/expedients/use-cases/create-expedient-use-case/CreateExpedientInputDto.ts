export class CreateExpedientInputDto {
  public readonly title: string;
  public readonly description: string;

  constructor(body: { title: string; description: string }) {
    this.validate(body);
    this.title = body.title;
    this.description = body.description;
  }

  private validate(body: { title: string; description: string }) {
    // we can do this with zod or class-validator
    if (!body.title || !body.description) {
      throw new Error("Title and description are required");
    }
  }
}
