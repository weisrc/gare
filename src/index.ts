import { route } from "./route";
import type { Endpoint } from "./types";

const root = route("/api");

type UserInfo = {
  userId: string;
  userName: string;
};

async function userAuth(): Promise<UserInfo> {
  return {
    userId: "123",
    userName: "John Doe",
  };
}

const users = root.route("/users").use(userAuth);

const getUser = users.route("/*").get((c) => {
  c.userId
});
