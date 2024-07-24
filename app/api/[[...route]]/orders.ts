import { db } from "@/db/drizzle";
import {
  sizes,
  insertSizeSchema,
  insertOrderSchema,
  orders,
  orderItems,
  products,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

import { Hono } from "hono";

const additionalFieldsSchema = z.object({
  products: z.array(z.string()),
});

const app = new Hono()
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertOrderSchema
        .omit({
          id: true,
        })
        .merge(additionalFieldsSchema)
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "unauthorized" }, 401);
      }

      const newOrder = await db
        .insert(orders)
        .values({
          id: createId(),
          isPaid: values.isPaid,
          phone: values.phone,
          address: values.address,
        })
        .returning();

      const orderId = newOrder[0].id;

      for (const item of values.products) {
        await db.insert(orderItems).values({
          id: createId(),
          orderId,
          productId: item,
        });
      }

      return c.json({ order: newOrder[0] });
    }
  )
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const data = await db
      .select({
        id: orders.id,
        isPaid: orders.isPaid,
        phone: orders.phone,
        address: orders.address,
        createdAt: orders.createdAt,
        products: sql`json_agg(jsonb_build_object(
            'productId', ${orderItems.productId},
            'productName', ${products.name}
          ))`,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .groupBy(orders.id);

    return c.json({ data });
  });

export default app;
