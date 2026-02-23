export interface IUser {
  id: number;
  userName: string;
}

export class User implements IUser {
  readonly id: number;
  readonly userName: string;

  constructor(id: number, userName: string) {
    this.id = id;
    this.userName = userName;
  }
}
