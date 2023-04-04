import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dtos/create-post.dto";
import { CurrentUser } from "../../decorators/current-user.decorator";
import { JwtTokenUserDto } from "../auth/dtos/jwt-token-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreatePostDto, @CurrentUser() user: JwtTokenUserDto) {
    console.log(body)
    return await this.postsService.create(body, user.id);
  }

}

