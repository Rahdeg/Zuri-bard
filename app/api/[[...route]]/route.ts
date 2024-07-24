import { Hono } from "hono";
import { handle } from "hono/vercel";
// import accounts from "./accounts";
import categories from "./categories";
import sizes from "./sizes";
import colors from "./colors";
import products from "./products";
// import transactions from "./transactions";
// import summary from "./summary";
// import plaid from "./plaid";
// import subscriptions from "./subscriptions";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app
  // .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/sizes", sizes)
  .route("/colors", colors)
  .route("/products", products);
// .route("/transactions", transactions)
// .route("/summary", summary)
// .route("/plaid", plaid)
// .route("/subscriptions", subscriptions);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
