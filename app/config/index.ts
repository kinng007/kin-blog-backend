import { Config } from "./types";
import dotenv from "dotenv";
import path from "path";

//dotenv.config({ path: path.join(__dirname, "..", "..", "..", ".env") });

dotenv.config({ path: "/etc/app/.env" });

console.log(process.env);

const config: Config = {
  port: (process.env.PORT && Number.parseInt(process.env.PORT)) || 3000,
  mongoUrl: process.env.DB_CONNECTION_STRING || "configNotPresent",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "googleClientIdNotPresent",
  devEmail: process.env.DEV_EMAIL || "emailNotPresent",
};

export default config;
