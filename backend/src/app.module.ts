import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/user.entity";

@Module({
  controllers: [AppController],
  imports: [TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User], // 엔티티 넣어
      synchronize: true
    }), UsersModule],
  providers: [AppService],
})
export class AppModule {
}
