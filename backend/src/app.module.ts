import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsModule } from "./modules/posts/posts.module";
import { CommentsModule } from "./modules/comments/comments.module";
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import ormconfig from "./config/ormconfig";
import configuration from "./config/configuration";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { CategoriesModule } from './modules/categories/categories.module';
import { EmailModule } from './infrastructure/email/email.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRoot(ormconfig),
    EmailModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    CategoriesModule,
    EmailModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ]
})
export class AppModule {
}
