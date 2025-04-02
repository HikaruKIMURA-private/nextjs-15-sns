import { prisma } from "./prisma";

export async function fetchPosts(userId: string) {
  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: [userId],
      },
    },
    include: {
      author: true,
      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
}
