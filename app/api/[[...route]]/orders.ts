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

// Define types for Order and OrderItem
type OrderItem = {
  productId: string;
  productName: string;
  size: string | null;
  color: string | null;
};

type Order = {
  id: string;
  isPaid: boolean | null;
  phone: string | null;
  address: string | null;
  totalAmount: number | null;
  createdAt: Date | null;
  products: OrderItem[];
};

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
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        products: sql<OrderItem[]>`json_agg(jsonb_build_object(
            'productId', ${orderItems.productId},
            'productName', ${products.name},
            'size', ${orderItems.size},
            'color', ${orderItems.color}
          ))::jsonb`,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .groupBy(orders.id)
      .execute();

    const ordersWithProducts = data.map((order) => ({
      ...order,
      products: order.products as unknown as OrderItem[],
    }));

    return c.json({ data: ordersWithProducts });
  })
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .delete(orders)
        .where(inArray(orders.id, values.ids))
        .returning({
          id: orders.id,
        });

      return c.json({ data });
    }
  );

export default app;
