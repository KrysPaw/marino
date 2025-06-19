import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "inva_user",
  password: "inva_password",
  database: "inva_db",
  synchronize: true, // Set to false in production
  logging: true,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migrations/**/*.ts"],
  subscribers: ["dist/subscribers/**/*.ts"],
});