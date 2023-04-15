import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from "../modules/users/entities/user.entity";
import { Post } from "../modules/posts/entities/post.entity";
import { PostLike } from "../modules/posts/entities/post-like.entity";
import { Comment } from "../modules/comments/entities/comment.entity";
import { CommentLike } from "../modules/comments/entities/comment-like.entity";
import { Category } from "../modules/categories/entities/category.entity";
import { AuthUser } from "../modules/users/entities/auth-user.entity";

const defaultConfig = {
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    // path.join(__dirname, '../modules/**/entities/*.entity.ts') // 이게 왜 동작을 안하지...?
    User, Post, Comment, PostLike, CommentLike, Category, AuthUser
  ],
  migrations: ['migrations/*.js'],
};

const envConfigs = {
  development: {
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: true,
    logging: true,
  },
  test: {
    type: 'sqlite',
    database: 'test.sqlite',
    migrationsRun: true,
  },
  production: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    migrationsRun: true,
  },
};

const currentEnv = process.env.NODE_ENV || 'development';
const envConfig = envConfigs[currentEnv];

if (!envConfig) {
  throw new Error('Unknown environment');
}

const ormconfig = {
  ...defaultConfig,
  ...envConfig,
};

export default ormconfig;