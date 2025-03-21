// components/PostForm.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "./Icons";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export default function PostForm() {
  const addPostAction = async (formData: FormData) => {
    "use server";

    try {
      const { userId } = auth();

      const post = formData.get("post") as string;
      const postTextSchema = z
        .string()
        .min(1, { message: "ポストを入力してください" })
        .max(140, { message: "140文字以内で入力してください" });

      const validated = postTextSchema.parse(post);

      if (!userId) return;

      await prisma.post.create({
        data: {
          content: validated,
          authorId: userId,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { error: error.errors.map((e) => e.message), success: false };
      }
      if (error instanceof Error) {
        return { error: error.message, success: false };
      }
      return { error: "予期せぬエラーが発生しました", success: false };
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <form action={addPostAction} className="flex-1 flex items-center">
        <Input
          type="text"
          placeholder="What's on your mind?"
          className="flex-1 rounded-full bg-muted px-4 py-2"
          name="post"
        />
        <Button variant="ghost" size="icon">
          <SendIcon className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Tweet</span>
        </Button>
      </form>
    </div>
  );
}
