// components/PostForm.tsx
"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "./Icons";
import { useRef, useEffect } from "react";
import { addPostAction } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { postTextSchema } from "@/prisma/schema/posts";

export default function PostForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  const [lastResult, formAction] = useFormState(addPostAction, {
    error: undefined,
  });

  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: postTextSchema });
    },
  });

  useEffect(() => {
    if (formRef.current && form.status === "success") {
      formRef.current.reset();
    }
  }, [form.status]);

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
          id={form.id}
        >
          <Input
            id={fields.post.id}
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 rounded-full bg-muted px-4 py-2"
            name={fields.post.name}
          />
          <Button variant="ghost" size="icon" disabled={pending}>
            <SendIcon className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Tweet</span>
          </Button>
        </form>
      </div>
      {fields.post.errors && (
        <p className="text-destructive ml-1 ml-14">{fields.post.errors[0]}</p>
      )}
    </div>
  );
}
