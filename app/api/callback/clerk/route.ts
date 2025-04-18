import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      const b = JSON.parse(body).data;
      await prisma.user.create({
        data: {
          id: evt.data.id,
          username: b.username,
          image: b.image_url,
        },
      });
      return new Response("User created", {
        status: 200,
      });
    } catch (error) {
      console.error("Error: Could not create user:", error);
      return new Response("Error: Could not create user", {
        status: 500,
      });
    }
  }

  if (eventType === "user.updated") {
    try {
      const b = JSON.parse(body).data;
      await prisma.user.update({
        where: {
          id: evt.data.id,
        },
        data: {
          username: b.username,
          image: b.image_url,
        },
      });
      return new Response("User updated", {
        status: 200,
      });
    } catch (error) {
      console.error("Error: Could not update user:", error);
      return new Response("Error: Could not update user", {
        status: 500,
      });
    }
  }
  return new Response("Webhook received", { status: 200 });
}
