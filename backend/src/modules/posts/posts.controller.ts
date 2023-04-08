import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dtos/create-post.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtTokenUserDto } from "../auth/dtos/jwt-token-user.dto";
import { PostResponseDto } from "./dtos/responses/post-response.dto";
import { Serialize } from "../../interceptors/serialize.interceptor";
import { UpdateUserDto } from "../users/dtos/update-user.dto";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { Public } from "../auth/decorators/public.decorator";
import { GetPostsDto } from "./dtos/get-posts.dto";

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @Serialize(PostResponseDto)
  async create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: JwtTokenUserDto) {
    return await this.postsService.create(createPostDto, user.id);
  }

  @Public()
  @Get()
  getPosts(@Query() getPostsDto: GetPostsDto) {
    return this.postsService.getPosts(getPostsDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

}
