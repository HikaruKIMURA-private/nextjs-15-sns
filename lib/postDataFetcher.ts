import { prisma } from "./prisma";

export async function fetchPosts(userId: string, username?: string) {
  if (username) {
    // プロフィール
    return await prisma.post.findMany({
      where: {
        author: {
          username,
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
  }

  if (!username) {
    // タイムライン
    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });
    const followingIds = following.map((f) => f.followingId);
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: [userId, ...followingIds],
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
}
