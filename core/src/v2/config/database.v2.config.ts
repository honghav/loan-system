import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getV2DatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL_V2');
  const primaryDbUrl = configService.get<string>('DATABASE_URL');
  const password = configService.get<string>('DB_PASSWORD');
  const isSsl = configService.get<string>('DB_SSL') === 'true';

  const baseConfig: TypeOrmModuleOptions = {
    name: 'v2Connection',
    type: 'postgres',
    entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
    synchronize: true, // Dev mode schema synchronization
    logging: process.env.NODE_ENV !== 'production',
    extra: {
      ssl: isSsl || !!databaseUrl || !!primaryDbUrl ? { rejectUnauthorized: false } : false,
    },
  };

  // If explicit V2 database connection URL is provided
  if (databaseUrl) {
    return {
      ...baseConfig,
      url: databaseUrl,
    };
  }

  // Database 2 name is explicitly 'project_manager' (or overridden via DB_DATABASE_V2)
  const dbName = configService.get<string>('DB_DATABASE_V2', 'project_manager');

  if (primaryDbUrl) {
    const urlObj = new URL(primaryDbUrl);
    urlObj.pathname = `/${dbName}`;
    return {
      ...baseConfig,
      url: urlObj.toString(),
    };
  }

  return {
    ...baseConfig,
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: password || 'postgres',
    database: dbName,
  };
};
