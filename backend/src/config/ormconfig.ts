import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const ormconfig = {
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  migrations: ['migrations/*.js'],
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(ormconfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(ormconfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(ormconfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
    });
    break;
  default:
    throw new Error('unknown environment');
}

export default ormconfig;
