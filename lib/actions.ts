"use server";

import { prisma } from "@/lib/prisma";
import { postTextSchema } from "@/prisma/schema/posts";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { parseWithZod } from "@conform-to/zod";
import { likeSchema } from "@/prisma/schema/likes";

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

export const likeAction = async (formData: FormData) => {
  "use server";
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const submission = parseWithZod(formData, { schema: likeSchema });
  if (submission.status !== "success") {
    throw new Error("Invalid form data");
  }
  const existingLike = await prisma.like.findFirst({
    where: {
      postId: submission.value.postId,
      userId,
    },
  });
  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
    revalidatePath("/");
  } else {
    await prisma.like.create({
      data: {
        postId: submission.value.postId,
        userId,
      },
    });
    revalidatePath("/");
  }
};
