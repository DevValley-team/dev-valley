import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { CommentsService } from "./comments.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { GetCommentsDto } from "./dtos/get-comments.dto";
import { Public } from "../../common/decorators/public.decorator";
import { Serialize } from "../../common/interceptors/serialize.interceptor";
import { CommentResponseDto } from "./dtos/response/comment-response.dto";
import { UpdateCommentDto } from "./dtos/update-comment.dto";
import { RemoveCommentDto } from "./dtos/remove-comment.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../../common/dtos/page.dto";
import { CreateCommentResponseDto } from "./dtos/response/create-comment-response.dto";

@ApiTags('댓글')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '댓글 작성' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateCommentResponseDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serialize(CreateCommentResponseDto)
  async create(@Body() createCommentDto: CreateCommentDto,
               @CurrentUser() currentUser: CurrentUserDto) {
    return await this.commentsService.createComment(createCommentDto, currentUser);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @ApiResponse({ status: HttpStatus.OK, type: CommentResponseDto })
  @Patch(':id')
  @Serialize(CommentResponseDto)
  async update(@Param('id', ParseIntPipe) id: number,
               @Body() updateCommentDto: UpdateCommentDto,
               @CurrentUser() currentUser: CurrentUserDto) {
    return await this.commentsService.updateComment(id, updateCommentDto, currentUser);
  }

  @ApiOperation({ summary: '댓글 삭제 (내용만 수정함)' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number,
               @CurrentUser() currentUser: CurrentUserDto) {
    const removeCommentDto = new RemoveCommentDto();
    await this.commentsService.updateComment(id, removeCommentDto, currentUser);
  }

  @ApiOperation({ summary: '댓글 조회' })
  @ApiPaginatedResponse(CommentResponseDto)
  @Public()
  @Get('')
  async getComments(@Query() getCommentsDto: GetCommentsDto): Promise<PageDto<CommentResponseDto>> {
    return await this.commentsService.getComments(getCommentsDto);
  }

  @Post(':id/like')
  like(@Param('id', ParseIntPipe) id: number) {

  }

  @Delete(':id/like')
  dislike(@Param('id', ParseIntPipe) id: number) {

  }

}
