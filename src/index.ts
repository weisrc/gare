import { route } from "./route";
import type { GareContext, GareOutput, Layer, Public } from "./types";

type UserData = {
  user: string;
};

const addUser: Public<Layer<GareContext, GareOutput, UserData, GareOutput>> = (
  input,
  inner
) => {
  const out = inner({
    ...input,
    user: "123",
  });

  return out;
};

type AuthData = {
  authSuccess: boolean;
};

const authUser: Layer<UserData, GareOutput, AuthData, GareOutput> = (
  input,
  inner
) => {
  if (input.user === "123") {
    return inner({
      ...input,
      authSuccess: true,
    });
  }

  throw new Error("Unauthorized");
};

const errorCatch: Layer<unknown, GareOutput, unknown, GareOutput> = (
  input,
  inner
) => {
  try {
    return inner(input);
  } catch (e) {
    return inner(input);
  }
};

const root = route("/api{asdf}")
  .route("/another/{id}")
  .layer(addUser)
  .layer(authUser)
  .layer(addUser)
  .layer(errorCatch);

const hello = root.endpoint("POST", (c) => {
  return {
    status: 200,
    body: c.user,
  } as any;
});

const test = hello.public({
  user: "123",
  params: {
    asdf: "123",
    id: "456",
  },
});
