import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dtos/create-post.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CurrentUserDto } from "../auth/dtos/current-user.dto";
import { PostDetailsResponseDto } from "./dtos/responses/post-details-response.dto";
import { Serialize } from "../../interceptors/serialize.interceptor";
import { UpdateUserDto } from "../users/dtos/update-user.dto";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { Public } from "../auth/decorators/public.decorator";
import { GetPostsDto } from "./dtos/get-posts.dto";

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @HttpCode(201)
  @Serialize(PostDetailsResponseDto)
  async create(@Body() createPostDto: CreatePostDto,
               @CurrentUser() currentUser: CurrentUserDto) {
    return await this.postsService.create(createPostDto, currentUser);
  }

  @Public()
  @Get()
  getPosts(@Query() getPostsDto: GetPostsDto) {
    return this.postsService.getPosts(getPostsDto);
  }

  @Public()
  @Get(':id')
  @Serialize(PostDetailsResponseDto)
  getPostDetails(@Param('id') id: string,
                 @CurrentUser() currentUser: CurrentUserDto) {
    return this.postsService.getPostDetails(+id, currentUser);
  }

  @Patch(':id')
  @HttpCode(204)
  update(@Param('id') id: string,
         @Body() updatePostDto: UpdatePostDto,
         @CurrentUser() currentUser: CurrentUserDto) {
    return this.postsService.update(+id, updatePostDto, currentUser);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string,
         @CurrentUser() currentUser: CurrentUserDto) {
    return this.postsService.softRemove(+id, currentUser);
  }

}
