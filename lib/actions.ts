"use server";

import { prisma } from "@/lib/prisma";
import { postTextSchema } from "@/prisma/schema/posts";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { parseWithZod } from "@conform-to/zod";

export async function addPostAction(_: unknown, formData: FormData) {
  const { userId } = auth();

  const submission = parseWithZod(formData, { schema: postTextSchema });

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.post.create({
    data: {
      content: submission.value.post,
      authorId: userId,
    },
  });

  revalidatePath("/");
}
