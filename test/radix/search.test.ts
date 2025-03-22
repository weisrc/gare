import { expect, test } from "bun:test";
import { radix } from "~/radix";

test("no params", () => {
  const search = radix({
    "api/users": "all users page",
    "api/posts": "all posts page",
  });

  expect(search("api/users")).toEqual({
    value: "all users page",
    params: {},
  });
});

test("1 param", () => {
  const search = radix({
    "api/users/{user_id}": "user page",
    another: "another page",
  });

  expect(search("api/users/123")).toEqual({
    value: "user page",
    params: {
      user_id: "123",
    },
  });
});

test("2 params", () => {
  const search = radix({
    "api/users/{user_id}/posts/{post_id}": "one post page",
    another: "another page",
  });

  expect(search("api/users/123/posts/456")).toEqual({
    value: "one post page",
    params: {
      user_id: "123",
      post_id: "456",
    },
  });
});

test("greedy param", () => {
  const search = radix({
    "api/users/{user_id*}": "user page",
    "api/users/{user_id*}/posts/{post_id}": "one post page",
  });

  expect(search("api/users/123/posts-typo/456")).toEqual({
    value: "user page",
    params: {
      user_id: "123/posts-typo/456",
    },
  });
});

test("not-greedy param", () => {
  const search = radix({
    "api/users/{user_id}": "user page",
    "api/users/{user_id}/posts/{post_id}": "one post page",
  });

  expect(search("api/users/123/posts-typo/456")).toBeUndefined();
});

test("wildcard param", () => {
  const search = radix({
    "static/{path*}.{format}": "static file",
  });

  expect(search("static/css/main.css")).toEqual({
    value: "static file",
    params: {
      path: "css/main",
      format: "css",
    },
  });
});

test("not found", () => {
  const search = radix({
    "api/users": "all users page",
    "{*}": "404 page",
  });

  expect(search("api/users/123")).toEqual({
    value: "404 page",
    params: {},
  });
});

test("custom 404", () => {
  const search = radix({
    "api/users": "all users page",
    "{*}": "404 page",
    "{*}.js": "custom 404 page",
  });

  expect(search("api/users/123/script.js")).toEqual({
    value: "custom 404 page",
    params: {},
  });
});
