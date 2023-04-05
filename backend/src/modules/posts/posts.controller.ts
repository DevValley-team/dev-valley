import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dtos/create-post.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtTokenUserDto } from "../auth/dtos/jwt-token-user.dto";
import { PostResponseDto } from "./dtos/post-response.dto";
import { Serialize } from "../../interceptors/serialize.interceptor";

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @Serialize(PostResponseDto)
  async create(@Body() body: CreatePostDto, @CurrentUser() user: JwtTokenUserDto) {
    return await this.postsService.create(body, user.id);
  }

}
