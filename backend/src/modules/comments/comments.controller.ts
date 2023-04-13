import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { CommentsService } from "./comments.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { GetCommentsDto } from "./dtos/get-comments.dto";
import { Public } from "../../common/decorators/public.decorator";
import { Serialize } from "../../common/interceptors/serialize.interceptor";
import { CommentResponseDto } from "./dtos/comment-response.dto";
import { UpdateCommentDto } from "./dtos/update-comment.dto";
import { RemoveCommentDto } from "./dtos/remove-comment.dto";

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createCommentDto: CreateCommentDto,
               @CurrentUser() currentUser: CurrentUserDto) {
    return await this.commentsService.create(createCommentDto, currentUser);
  }

  @Public()
  @Get('')
  @Serialize(CommentResponseDto)
  async getComments(@Query() getCommentsDto: GetCommentsDto) {
    return await this.commentsService.getComments(getCommentsDto);
  }

  @Patch(':id')
  @HttpCode(204)
  update(@Param('id', ParseIntPipe) id: number,
         @Body() updateCommentDto: UpdateCommentDto,
         @CurrentUser() currentUser: CurrentUserDto) {
    return this.commentsService.update(id, updateCommentDto, currentUser);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number,
         @CurrentUser() currentUser: CurrentUserDto) {
    const removeCommentDto = new RemoveCommentDto();
    return this.commentsService.update(id, removeCommentDto, currentUser);
  }

  @Post(':id/like')
  like(@Param('id', ParseIntPipe) id: number) {

  }

  @Delete(':id/like')
  dislike(@Param('id', ParseIntPipe) id: number) {

  }

}
