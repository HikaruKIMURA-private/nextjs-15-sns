// components/PostList.tsx
import { auth } from "@clerk/nextjs/server";
import { fetchPosts } from "@/lib/postDataFetcher";
import { Post } from "./Post";

export default async function PostList({ username }: { username?: string }) {
  const { userId } = await auth();
  if (!userId) return;

  const posts = await fetchPosts(userId, username);

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p>No posts yet</p>
      )}
    </div>
  );
}
