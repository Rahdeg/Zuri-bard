import { Hono } from "hono";
import Stripe from "stripe";
import { eq, inArray } from "drizzle-orm";
import { orderItems, orders, products } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { db } from "@/db/drizzle";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const app = new Hono();

app.use("*", async (c, next) => {
  c.res.headers.set("Access-Control-Allow-Origin", "*");
  c.res.headers.set("Access-Control-Allow-Methods", "POST, HEAD");
  c.res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  await next();
});

app.post("/", async (c) => {
  if (c.req.method !== "POST") {
    c.res.headers.set("Allow", "POST");
    return c.text("Method Not Allowed", 405);
  }

  let buf: Buffer;
  try {
    buf = await getRawBody(c.req.raw);
  } catch (err) {
    console.log(`Error reading request buffer: ${err}`);
    return c.json({ error: "Error reading request buffer" }, 500);
  }

  const signature = c.req.header("stripe-signature");
  if (!signature) {
    console.log("Missing Stripe signature header");
    return c.json({ error: "Missing Stripe signature header" }, 400);
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.log(`❌ Error message: ${errorMessage}`);
    return c.json({ error: `Webhook Error: ${errorMessage}` }, 400);
  }

  console.log("✅ Success:", event.id);

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;
  const addressComponents = [address?.line1, address?.state, address?.country];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    try {
      const updatedOrder = await db
        .update(orders)
        .set({
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || "",
          totalAmount: session.amount_total || 0,
        })
        .where(eq(orders.id, session?.metadata?.orderId!))
        .returning();

      if (!updatedOrder.length) {
        console.log("Order not found or not updated");
        return c.json({ error: "Order not found or not updated" }, 404);
      }

      const orderItemsResult = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, session?.metadata?.orderId!));

      const productIds = orderItemsResult.map(
        (orderItem) => orderItem.productId
      );
      await db
        .update(products)
        .set({ isArchived: true })
        .where(inArray(products.id, productIds));

      console.log("Order and products updated successfully");
    } catch (err) {
      console.log(`Database error: ${err}`);
      return c.json({ error: "Database error" }, 500);
    }
  }

  return c.text("", 200);
});

async function getRawBody(req: Request): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) {
    throw new Error("No request body");
  }

  let result;
  while (!(result = await reader.read()).done) {
    chunks.push(result.value);
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

export default app;
