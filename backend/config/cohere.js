import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.COHERE_API_KEY) {
  console.error("❌ Missing COHERE_API_KEY in .env");
  process.exit(1);
}

export const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});
