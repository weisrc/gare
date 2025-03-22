import { bench, run, summary } from "mitata";
import {
  allComments,
  allPosts,
  allReplies,
  allUsers,
  earlyNotFound,
  invalid,
  lateNotFound,
  long,
  oneComment,
  onePost,
  oneReply,
  oneUser,
} from "~fixture/radix/social-media";

summary(() => {
  bench("all users", allUsers);
  bench("one user", oneUser);
  bench("all posts", allPosts);
  bench("one post", onePost);
  bench("all comments", allComments);
  bench("one comment", oneComment);
  bench("all replies", allReplies);
  bench("one reply", oneReply);
  bench("early not found", earlyNotFound);
  bench("late not found", lateNotFound);
  bench("long", long);
  bench("invalid", invalid);
});

await run()
