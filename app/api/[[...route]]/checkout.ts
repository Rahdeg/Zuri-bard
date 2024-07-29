import { db } from "@/db/drizzle";
import { orders, orderItems, products } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { Hono } from "hono";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      color: z.string().optional(),
      size: z.string().optional(),
    })
  ),
});

const app = new Hono().post(
  "/orders",
  clerkMiddleware(),
  zValidator("json", orderSchema),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "unauthorized" }, 401);
    }

    if (!values.items || values.items.length === 0) {
      return c.json({ error: "Product IDs are required" }, 400);
    }

    const newOrder = await db
      .insert(orders)
      .values({
        id: createId(),
        isPaid: false,
        phone: "",
        address: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const orderId = newOrder[0].id;

    const productItems = [];
    for (const item of values.items) {
      const product = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
        })
        .from(products)
        .where(eq(products.id, item.productId))
        .execute();

      if (product.length === 0) {
        return c.json(
          { error: `Product with ID ${item.productId} not found` },
          404
        );
      }

      productItems.push(...product);

      await db.insert(orderItems).values({
        id: createId(),
        orderId,
        productId: item.productId,
        color: item.color || "",
        size: item.size || "",
      });
    }

    const line_items = productItems.map((product) => ({
      quantity: 1,
      price_data: {
        currency: "NGN",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
      metadata: {
        orderId,
      },
    });

    return c.json({ url: session.url });
  }
);

export default app;
