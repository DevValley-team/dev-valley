import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dtos/create-post.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { PostDetailsResponseDto } from "./dtos/response/post-details-response.dto";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { Public } from "../../common/decorators/public.decorator";
import { GetPostsDto } from "./dtos/get-posts.dto";
import { SerializeAndSetIsAuthor } from "../../common/interceptors/serialize-and-set-is-author.interceptor";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PageDto } from "../../common/dtos/page.dto";
import { PostSummaryResponseDto } from "./dtos/response/post-summary-response.dto";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { CreatePostResponseDto } from "./dtos/response/create-post-response.dto";
import { Serialize } from "../../common/interceptors/serialize.interceptor";

@ApiTags('게시물')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({ summary: '게시글 작성' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreatePostResponseDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPostDto: CreatePostDto,
               @CurrentUser() currentUser: CurrentUserDto) {
    return await this.postsService.create(createPostDto, currentUser);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @ApiResponse({ status: HttpStatus.OK, type: PostDetailsResponseDto })
  @Patch(':id')
  @SerializeAndSetIsAuthor(PostDetailsResponseDto)
  async update(@Param('id', ParseIntPipe) id: number,
               @Body() updatePostDto: UpdatePostDto,
               @CurrentUser() currentUser: CurrentUserDto) {
    return await this.postsService.update(id, updatePostDto, currentUser);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number,
               @CurrentUser() currentUser: CurrentUserDto) {
    await this.postsService.softRemove(id, currentUser);
  }

  @ApiOperation({ summary: '카테고리별 게시글 목록 조회' })
  @ApiPaginatedResponse(PostSummaryResponseDto)
  @Public()
  @Get()
  async getPostsByCategory(@Query() getPostsDto: GetPostsDto): Promise<PageDto<PostSummaryResponseDto>> {
    return await this.postsService.getPostsByCategory(getPostsDto);
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @ApiResponse({ status: HttpStatus.OK, type: PostDetailsResponseDto })
  @Public()
  @Get(':id')
  @SerializeAndSetIsAuthor(PostDetailsResponseDto)
  async getPostDetails(@Param('id', ParseIntPipe) id: number,
                       @CurrentUser() currentUser: CurrentUserDto) {
    return await this.postsService.getPostDetails(id);
  }

  @Post(':id/like')
  async likePost(@Param('id', ParseIntPipe) id: number,
                 @CurrentUser() currentUser: CurrentUserDto) {
    return await this.postsService.likePost(id, currentUser);
  }

  @Delete(':id/like')
  async unlikePost(@Param('id', ParseIntPipe) id: number,
                   @CurrentUser() currentUser: CurrentUserDto) {
    return await this.postsService.unlikePost(id, currentUser);
  }

}
