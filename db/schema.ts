import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import z, { number } from "zod";

import { createInsertSchema } from "drizzle-zod";

// Category table
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// Size table
export const sizes = pgTable("sizes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sizeRelations = relations(sizes, ({ many }) => ({
  productSizes: many(productSizes),
}));

// Color table
export const colors = pgTable("colors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const colorRelations = relations(colors, ({ many }) => ({
  productColors: many(productColors),
}));

// Product table
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  sizes: many(productSizes),
  colors: many(productColors),
  images: many(images),
  orderItems: many(orderItems),
}));

// Product Sizes table for many-to-many relationship
export const productSizes = pgTable("product_sizes", {
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sizeId: text("size_id")
    .notNull()
    .references(() => sizes.id, { onDelete: "cascade" }),
});

export const productSizeRelations = relations(productSizes, ({ one }) => ({
  product: one(products, {
    fields: [productSizes.productId],
    references: [products.id],
  }),
  size: one(sizes, {
    fields: [productSizes.sizeId],
    references: [sizes.id],
  }),
}));

// Product Colors table for many-to-many relationship
export const productColors = pgTable("product_colors", {
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  colorId: text("color_id")
    .notNull()
    .references(() => colors.id, { onDelete: "cascade" }),
});

export const productColorRelations = relations(productColors, ({ one }) => ({
  product: one(products, {
    fields: [productColors.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [productColors.colorId],
    references: [colors.id],
  }),
}));

// Image table
export const images = pgTable("images", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const imageRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}));

// Order table
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  isPaid: boolean("is_paid").default(false),
  phone: text("phone").default(""),
  totalAmount: integer("totalAmount").default(0),
  address: text("address").default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));

// OrderItem table
export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  color: text("color").default(""),
  size: text("size").default(""),
});

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// Schemas
export const insertCategorySchema = createInsertSchema(categories);
export const insertSizeSchema = createInsertSchema(sizes);
export const insertColorSchema = createInsertSchema(colors);
export const insertProductSchema = createInsertSchema(products);
export const insertImageSchema = createInsertSchema(images);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertProductSizeSchema = createInsertSchema(productSizes);
export const insertProductColorSchema = createInsertSchema(productColors);
