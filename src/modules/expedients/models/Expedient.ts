import { v4 as uuidv4 } from "uuid";

export class Expedient {
  static new(title: string, description: string) {
    if (!title || !description) {
      throw new Error("Title and description are required");
    }
    return new Expedient(uuidv4(), title, description, false, new Date(), new Date());
  }

  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public completed: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(id: string, title: string, description: string, completed: boolean, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  complete() {
    this.completed = true;
    this.updatedAt = new Date();
  }

  uncomplete() {
    if (!this.completed) {
      throw new Error("Todo is not completed");
    }
    this.completed = false;
    this.updatedAt = new Date();
  }

  update(title?: string, description?: string, completed?: boolean): Expedient {
    return new Expedient(
      this.id,
      title ?? this.title,
      description ?? this.description,
      completed ?? this.completed,
      this.createdAt,
      new Date()
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
