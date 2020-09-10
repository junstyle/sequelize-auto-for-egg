
import _ from "lodash";
import { Sequelize } from "sequelize";
import { AutoBuilder } from "./auto-builder";
import { TableData } from "./types";

class AutoSequelize {
  sequelize: Sequelize;
  options: any;

  constructor(database: string | Sequelize, username: string, password: string, options: any) {
    if (options && options.dialect === 'sqlite' && !options.storage) {
      options.storage = database;
    }
    if (options && options.dialect === 'mssql') {
      // set defaults for tedious, to silence the warnings
      options.dialectOptions = options.dialectOptions || {};
      options.dialectOptions.options = options.dialectOptions.options || {};
      options.dialectOptions.options.trustServerCertificate = true;
      options.dialectOptions.options.enableArithAbort = true;
      options.dialectOptions.options.validateBulkLoadParameters = true;
    }

    if (database instanceof Sequelize) {
      this.sequelize = database;
    } else {
      this.sequelize = new Sequelize(database, username, password, options || {});
    }


    this.options = _.extend({
      global: 'Sequelize',
      local: 'sequelize',
      spaces: false,
      indentation: 1,
      directory: './models',
      additional: {},
      freezeTableName: true,
      typescript: false,
      closeConnectionAutomatically: true
    }, options || {});

  }

  build(): Promise<TableData> {
    const builder = new AutoBuilder(this.sequelize, this.options.tables, this.options.skipTables, this.options.schema);
    return builder.build().then(tableData => {
      if (this.options.closeConnectionAutomatically) {
        return this.sequelize.close().then(() => tableData);
      }
      return tableData;
    });
  }
}
