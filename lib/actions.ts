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

export const followAction = async (userId: string) => {
  "use server";
  const { userId: currentUserId } = auth();
  if (!currentUserId) {
    throw new Error("User not found");
  }

  try {
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId,
          },
        },
      });
    } else {
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: userId,
        },
      });
    }
    revalidatePath(`/profile/${userId}`);
  } catch (error) {
    console.error(error);
  }
};
