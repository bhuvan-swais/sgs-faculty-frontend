import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: process.env.NODE_ENV === "production" ? "/faculty" : "",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
