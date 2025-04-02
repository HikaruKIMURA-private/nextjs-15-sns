// components/PostForm.tsx
"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "./Icons";
import { useRef } from "react";
import { addPostAction } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";

export default function PostForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(addPostAction, {
    error: undefined,
    success: false,
  });

  if (state.success && formRef.current) {
    formRef.current.reset();
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <form
          ref={formRef}
          action={formAction}
          className="flex-1 flex items-center"
        >
          <Input
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 rounded-full bg-muted px-4 py-2"
            name="post"
          />
          <Button variant="ghost" size="icon" disabled={pending}>
            <SendIcon className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Tweet</span>
          </Button>
        </form>
      </div>
      {state.error && (
        <p className="text-destructive ml-1 ml-14">{state.error}</p>
      )}
    </div>
  );
}
