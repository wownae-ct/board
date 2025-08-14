import { Module } from '@nestjs/common';
import { MysqlAccessService } from './mysql-access.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { drizzle } from "drizzle-orm/mysql2";
import * as process from "node:process";
import * as mysql from "mysql2/promise";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MysqlAccessService,
      useFactory: async(configService: ConfigService) => {
        let dbEnvironment = configService.get<string>('DB_ENV');
        if (!dbEnvironment) {
          throw new Error('Missing database environment variable(dev|prod)');
        }
        dbEnvironment = dbEnvironment?.toUpperCase();
        switch (dbEnvironment) {
          case 'DEV': case 'PROD': {
            break;
          }
          default: {
            throw new Error('Missing database environment variable(dev|prod)');
          }
        }
        let dbHost = configService.get<string>(`${dbEnvironment}_DB_HOST`);
        let dbUser = configService.get<string>(`${dbEnvironment}_DB_USER`);
        let dbPasswd = configService.get<string>(`${dbEnvironment}_DB_PASSWORD`);
        let dbName = configService.get<string>(`${dbEnvironment}_DB_NAME`);
        let dbPort = configService.get<number>(`${dbEnvironment}_DB_PORT`);
        const poolConnection = mysql.createPool({
          host: dbHost,
          user: dbUser,
          password: dbPasswd,
          database: dbName,
          port: dbPort,
          waitForConnections: true,
          connectionLimit: 50,
          queueLimit: 100,
          idleTimeout: 60000,
          ssl: {
            rejectUnauthorized: false,
          }
        });

        const database = drizzle({ client: poolConnection });
        return new MysqlAccessService(database);
      },
      inject: [ConfigService],
    },
  ],
  exports: [MysqlAccessService],
})
export class MysqlAccessModule {}