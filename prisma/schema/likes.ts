import { z } from "zod";

export const likeSchema = z.object({
  postId: z.string({ required_error: "予期せぬエラーが発生しました" }),
  userId: z.string().nullable(),
});
