import { IUser } from "../interfaces/IUser";

export class User implements IUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public borrowedBooksCount: number = 0,
  ) {}

  incrementBorrowed(): void {
    this.borrowedBooksCount += 1;
  }

  decrementBorrowed(): void {
    if (this.borrowedBooksCount > 0) {
      this.borrowedBooksCount -= 1;
    }
  }
}
