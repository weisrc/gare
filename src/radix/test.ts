import { compress } from "./compress";
import { mergeAll } from "./merge";
import { parse } from "./parse";
import { search } from "./search";

const root = compress(
  mergeAll([
    parse("api/users/{user_id}", "user page"),
    parse("api/users/{user_id}/posts", "all posts page"),
    parse("api/users/{user_id}/posts/{post_id}", "one post page"),
    parse("api/users/{user_id}/posts/{post_id}/comments", "all comments page"),
    parse(
      "api/users/{user_id}/posts/{post_id}/comments/{comment_id}",
      "one comment page"
    ),
    parse("static/{path*}.{format}", "static file"),
  ])
);

console.log(JSON.stringify(root, null, 2));

console.log(search(root, "api/users/123/posts/456/comments", 0, {}));
console.log(search(root, "static/some/path/to/some/file.txt", 0, {}));
