// import type { Config } from "drizzle-kit";
// export default {
//   schema: "./src/models/",
//   out: "./drizzle",
// } satisfies Config;

import type { Config } from "drizzle-kit";
export default {
  schema: "./src/models/",
  out: "./drizzle",
  // driver: "pg",
} satisfies Config;
