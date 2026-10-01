export interface Identifiable {
  id: string;
}

export class Library<T extends Identifiable> {
  private items: T[] = [];

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  public add(item: T): void {
    const exists = this.items.some((i) => i.id === item.id);
    if (exists) {
      throw new Error(`Елемент із ID ${item.id} вже існує.`);
    }
    this.items.push(item);
  }

  public remove(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  public findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  public find(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  public getAll(): T[] {
    return [...this.items];
  }
}
