
import { DataSource } from "typeorm";
import { Users } from "./entities/Users.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [Users],
})