"use client";
import { HeartIcon, Share2Icon, MessageCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { auth } from "@clerk/nextjs/server";
import { useState } from "react";
import { likeAction } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { useOptimistic } from "react";

type PostInteractionProps = {
  postId: string;
  initialLikes: string[];
  commentNumber: number;
};

type OptimisticLikes = {
  likeCount: number;
  isLiked: boolean;
};
export const PostInteraction = ({
  postId,
  initialLikes,
  commentNumber,
}: PostInteractionProps) => {
  const { userId } = useAuth();
  const initialState = {
    likeCount: initialLikes.length,
    isLiked: userId ? initialLikes.includes(userId) : false,
  };

  const [optimisticLikes, updateOptimisticLikes] = useOptimistic<
    OptimisticLikes,
    void
  >(initialState, (currentState) => ({
    likeCount: currentState.isLiked
      ? currentState.likeCount - 1
      : currentState.likeCount + 1,
    isLiked: !currentState.isLiked,
  }));
  const handleLikeSubmit = async () => {
    try {
      updateOptimisticLikes();
      const formData = new FormData();
      formData.append("postId", postId);
      await likeAction(formData);
    } catch (error) {
      console.error(error);
      updateOptimisticLikes();
    }
  };

  return (
    <div className="flex items-center">
      <form action={handleLikeSubmit}>
        <Button variant="ghost" size="icon">
          <HeartIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
      </form>
      <span>{optimisticLikes.likeCount}</span>
      <Button variant="ghost" size="icon">
        <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <span>{commentNumber}</span>
      <Button variant="ghost" size="icon">
        <Share2Icon className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  );
};
