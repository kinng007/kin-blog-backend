import { Config } from "./types";
import dotenv from "dotenv";

dotenv.config({ path: "/etc/app/.env" });

const config: Config = {
  port: (process.env.PORT && Number.parseInt(process.env.PORT)) || 3000,
  mongoUrl: process.env.DB_CONNECTION_STRING || "configNotPresent",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "googleClientIdNotPresent",
  devEmail: process.env.DEV_EMAIL || "emailNotPresent",
};

export default config;
