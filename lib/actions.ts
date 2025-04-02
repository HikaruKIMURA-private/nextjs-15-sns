"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type State = {
  error: string | undefined;
  success: boolean;
};

export async function addPostAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const { userId } = auth();

    const post = formData.get("post") as string;
    const postTextSchema = z
      .string()
      .min(1, { message: "ポストを入力してください" })
      .max(140, { message: "140文字以内で入力してください" });

    const validated = postTextSchema.parse(post);

    if (!userId) {
      throw new Error("User is not authenticated");
    }

    await prisma.post.create({
      data: {
        content: validated,
        authorId: userId,
      },
    });

    revalidatePath("/");
    return { success: true, error: undefined };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const res = {
        error: error.errors.map((e) => e.message).join(", "),
        success: false,
      };
      return res;
    }
    if (error instanceof Error) {
      return { error: error.message, success: false };
    }
    return { error: "予期せぬエラーが発生しました", success: false };
  }
}
