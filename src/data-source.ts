import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Product } from "./entities/Product"; // ⚠️ garde le .js ici pour l'exécution après build

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // ex: postgres://user:password@ep-xxxxx.eu-central-1.aws.neon.tech/db
  ssl: { rejectUnauthorized: false }, // requis pour Neon
  synchronize: true, // ⚠️ dev uniquement, désactive-le en prod
  logging: true,
  entities: [Product], // on importe directement la classe
});
