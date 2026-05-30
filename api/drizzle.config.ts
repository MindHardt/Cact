import {defineConfig} from "drizzle-kit";
import {DATABASE_URL} from "./src/data/db.js";


export default defineConfig({
    out: './.drizzle',
    schema: './src/data/schemas/*',
    dialect: 'postgresql',
    dbCredentials: {
        url: DATABASE_URL,
    },
    casing: 'snake_case'
})