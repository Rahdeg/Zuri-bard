import { db } from "@/db/drizzle";
import {
  products,
  insertProductSchema,
  productSizes,
  productColors,
  images,
  categories,
  sizes,
  colors,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

const additionalFieldsSchema = z.object({
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  images: z.object({ url: z.string() }).array().nonempty("image is required"),
});

const extendedProductSchema = insertProductSchema
  .pick({
    name: true,
    categoryId: true,
    price: true,
    isFeatured: true,
    isArchived: true,
  })
  .merge(additionalFieldsSchema);

import { Hono } from "hono";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    // const auth = getAuth(c);

    // if (!auth?.userId) {
    //   return c.json({ error: "unauthorized" }, 401);
    // }

    const data = await db
      .select({
        id: products.id,
        name: products.name,
        categoryId: sql`array_agg(distinct ${categories.name})`,
        categoryName: categories.name,
        price: products.price,
        isFeatured: products.isFeatured,
        isArchived: products.isArchived,
        createdAt: products.createdAt,
        sizes: sql`array_agg(distinct ${sizes.name})`,
        colors: sql`array_agg(distinct ${colors.name})`,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(productSizes, eq(productSizes.productId, products.id))
      .leftJoin(sizes, eq(sizes.id, productSizes.sizeId))
      .leftJoin(productColors, eq(productColors.productId, products.id))
      .leftJoin(colors, eq(colors.id, productColors.colorId))
      .groupBy(
        products.id,
        categories.id,
        products.name,
        products.categoryId,
        categories.name,
        products.price,
        products.isFeatured,
        products.isArchived,
        products.createdAt
      );

    return c.json({ data });
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      // const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      // if (!auth?.userId) {
      //   return c.json({ error: "Unauthorized" }, 401);
      // }
      const [data] = await db
        .select({
          id: products.id,
          name: products.name,
          categoryId: products.categoryId,
          price: products.price,
          isFeatured: products.isFeatured,
          isArchived: products.isArchived,
          createdAt: products.createdAt,
          sizes: sql`array_agg(distinct ${sizes.id})`,
          colors: sql`array_agg(distinct ${colors.id})`,
          images: sql`array_agg(distinct ${images.url})`,
        })
        .from(products)
        .leftJoin(categories, eq(categories.id, products.categoryId))
        .leftJoin(productSizes, eq(productSizes.productId, products.id))
        .leftJoin(sizes, eq(sizes.id, productSizes.sizeId))
        .leftJoin(productColors, eq(productColors.productId, products.id))
        .leftJoin(colors, eq(colors.id, productColors.colorId))
        .leftJoin(images, eq(images.productId, products.id))
        .where(eq(products.id, id))
        .groupBy(
          products.id,
          categories.id,
          products.name,
          products.categoryId,
          categories.name,
          products.price,
          products.isFeatured,
          products.isArchived,
          products.createdAt
        );

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", extendedProductSchema),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "unauthorized" }, 401);
      }

      const [data] = await db
        .insert(products)
        .values({
          id: createId(),
          categoryId: values.categoryId,
          price: values.price,
          name: values.name,
          isFeatured: values.isFeatured,
          isArchived: values.isArchived,
        })
        .returning();

      const productId = data.id;

      if (values.sizes && Array.isArray(values.sizes)) {
        for (const sizeId of values.sizes) {
          await db.insert(productSizes).values({ productId, sizeId });
        }
      }

      // Insert colors
      if (values.colors && Array.isArray(values.colors)) {
        for (const colorId of values.colors) {
          await db.insert(productColors).values({ productId, colorId });
        }
      }

      if (values.images && Array.isArray(values.images)) {
        for (const imageUrlObj of values.images) {
          await db.insert(images).values({
            id: createId(),
            productId,
            url: imageUrlObj.url,
          });
        }
      }

      return c.json({ data });
    }
  )
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
        .delete(products)
        .where(inArray(products.id, values.ids))
        .returning({
          id: products.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertProductSchema.pick({
        name: true,
        categoryId: true,
        price: true,
        isFeatured: true,
        isArchived: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .update(products)
        .set(values)
        .where(eq(products.id, id))
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing Id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "unAuthorized" }, 401);
      }
      const [data] = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning({
          id: products.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;