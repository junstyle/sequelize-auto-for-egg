import { mssqlOptions } from "./dialect-mssql";
import { mysqlOptions } from "./dialect-mysql";
import { postgresOptions } from "./dialect-postgres";
import { sqliteOptions } from "./dialect-sqlite";
import { DialectOptions } from "./dialect-options";

export const dialects: { [name: string]: DialectOptions } = {
  mssql: mssqlOptions, 
  mysql: mysqlOptions,
  mariadb: mysqlOptions,
  postgres: postgresOptions,
  sqlite: sqliteOptions
};