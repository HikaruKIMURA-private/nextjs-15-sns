import { z } from "zod";

// export const postTextSchema = z
//   .string()
//   .min(1, { message: "ポストを入力してください" })
//   .max(140, { message: "140文字以内で入力してください" });

export const postTextSchema = z.object({
  post: z
    .string({ required_error: "ポストを入力してください" })
    .trim() //から文字は除外
    .min(1, { message: "ポストを入力してください" })
    .max(140, { message: "140文字以内で入力してください" }),
});
