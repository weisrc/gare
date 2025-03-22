import { radix } from "~/radix";

const longPath =
  "this-is-an-endpoint-with-an-extremely-long-name-for-testing-purpose-only";

const invalidPath =
  "invalid-as-it-does-not-start-with-a-slash-and-yet-it-works";

const search = radix({
  "/api/users": "all users",
  "/api/users/{userId}": "one user",
  "/api/users/{userId}/posts": "all posts",
  "/api/users/{userId}/posts/{postId}": "one post",
  "/api/users/{userId}/posts/{postId}/comments": "all comments",
  "/api/users/{userId}/posts/{postId}/comments/{commentId}": "one comment",
  "/api/users/{userId}/posts/{postId}/comments/{commentId}/replies":
    "all replies",
  "/api/users/{userId}/posts/{postId}/comments/{commentId}/replies/{replyId}":
    "one reply",
  "/api/{*}": "api not found",
  [longPath]: "long",
  "{*}": "not found",
  [invalidPath]: "invalid",
});

export function allUsers() {
  return search("/api/users");
}

export const userId = "average-username";
export const postId = "average-post-slug-for-testing-purpose-only";
export const commentId = "51af5e3a-e436-4db8-905d-154372dd5013";
export const replyId = "01a32387-7b47-4db2-8f30-73e10d6c098d";

export function oneUser() {
  return search("/api/users/" + userId);
}

export function allPosts() {
  return search("/api/users/" + userId + "/posts");
}

export function onePost() {
  return search("/api/users/" + userId + "/posts/" + postId);
}

export function allComments() {
  return search("/api/users/" + userId + "/posts/" + postId + "/comments");
}

export function oneComment() {
  return search(
    "/api/users/" + userId + "/posts/" + postId + "/comments/" + commentId
  );
}

export function allReplies() {
  return search(
    "/api/users/" +
      userId +
      "/posts/" +
      postId +
      "/comments/" +
      commentId +
      "/replies"
  );
}

export function oneReply() {
  return search(
    "/api/users/" +
      userId +
      "/posts/" +
      postId +
      "/comments/" +
      commentId +
      "/replies/" +
      replyId
  );
}

export function earlyNotFound() {
  return search("/api/users-insert-typo-here");
}

export function lateNotFound() {
  return search(
    "/api/users/" +
      userId +
      "/posts/" +
      postId +
      "/comments/" +
      commentId +
      "/replies-houston-we-have-a-problem"
  );
}

export function long() {
  return search(longPath);
}

export function invalid() {
  return search(invalidPath);
}
