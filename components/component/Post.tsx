import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HeartIcon,
  MessageCircleIcon,
  Share2Icon,
  ClockIcon,
} from "lucide-react";
import { PostInteraction } from "./PostInteraction";
import Link from "next/link";

type Like = {
  userId: string;
};

type PostType = {
  id: string;
  author: {
    name: string | null;
    username: string;
    image: string | null;
  };
  content: string;
  likes: Like[];
  _count: {
    replies: number;
  };
  createdAt: Date;
};

export const Post = ({ post }: { post: PostType }) => {
  return (
    <div
      key={post.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
    >
      <div className="flex items-center gap-4 mb-4">
        <Link href={`/profile/${post.author.username}`}>
          <Avatar className="w-10 h-10">
            {post.author.image ? (
              <AvatarImage src={post.author.image} />
            ) : (
              <AvatarFallback>AC</AvatarFallback>
            )}
          </Avatar>
        </Link>
        <div>
          <h3 className="text-lg font-bold">{post.author.name}</h3>
          <p className="text-muted-foreground">{post.author.username}</p>
        </div>
      </div>
      <div className="space-y-2">
        <p>{post.content}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <PostInteraction
            postId={post.id}
            initialLikes={post.likes.map((like: Like) => like.userId)}
            commentNumber={post._count.replies}
          />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ClockIcon className="h-5 w-5" />
          <span>{post.createdAt.toLocaleString()}</span>
        </div>
      </div>
      {/* {post.comments && (
  <div className="mt-4 border-t pt-4 space-y-2">
    {post.comments.map((comment, index) => (
      <div key={index} className="flex items-center gap-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{comment.author}</p>
          <p className="text-muted-foreground">{comment.content}</p>
        </div>
        <Button variant="ghost" size="icon">
          <HeartIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    ))}
  </div>
)} */}
    </div>
  );
};
