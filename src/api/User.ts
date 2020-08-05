import { Client } from "./types";

export default class UserApi {
  constructor(private client: Client) {}

  public getUserInfo(): Promise<any> {
    return Promise.resolve({});
  }
}
