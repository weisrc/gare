import { test, expect } from "bun:test";
import {
  allComments,
  allPosts,
  allReplies,
  allUsers,
  commentId,
  earlyNotFound,
  lateNotFound,
  long,
  oneComment,
  onePost,
  oneReply,
  oneUser,
  postId,
  replyId,
  userId,
  invalid,
} from "~fixture/radix/social-media";

test("all users", () => {
  expect(allUsers()).toEqual({
    value: "all users",
    params: {},
  });
});

test("one user", () => {
  expect(oneUser()).toEqual({
    value: "one user",
    params: {
      userId,
    },
  });
});

test("all posts", () => {
  expect(allPosts()).toEqual({
    value: "all posts",
    params: {
      userId,
    },
  });
});

test("one post", () => {
  expect(onePost()).toEqual({
    value: "one post",
    params: {
      userId,
      postId,
    },
  });
});

test("all comments", () => {
  expect(allComments()).toEqual({
    value: "all comments",
    params: {
      userId,
      postId,
    },
  });
});

test("one comment", () => {
  expect(oneComment()).toEqual({
    value: "one comment",
    params: {
      userId,
      postId,
      commentId,
    },
  });
});

test("all replies", () => {
  expect(allReplies()).toEqual({
    value: "all replies",
    params: {
      userId,
      postId,
      commentId,
    },
  });
});

test("one reply", () => {
  expect(oneReply()).toEqual({
    value: "one reply",
    params: {
      userId,
      postId,
      commentId,
      replyId,
    },
  });
});

test("early not found", () => {
  expect(earlyNotFound()).toEqual({
    value: "api not found",
    params: {},
  });
});

test("late not found", () => {
  expect(lateNotFound()).toEqual({
    value: "api not found",
    params: {},
  });
});

test("long", () => {
  expect(long()).toEqual({
    value: "long",
    params: {},
  });
});

test("invalid", () => {
  expect(invalid()).toEqual({
    value: "invalid",
    params: {},
  });
});
