import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from "typeorm";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";
import { PostsService } from "../posts/posts.service";
import { CommentLike } from "./entities/comment-like.entity";
import { Comment } from "./entities/comment.entity";
import { GetCommentsDto } from "./dtos/get-comments.dto";
import { PageDto } from "../../common/dtos/page.dto";
import { CommentResponseDto } from "./dtos/response/comment-response.dto";

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>,
              @InjectRepository(CommentLike) private commentLikeRepository: Repository<CommentLike>,
              private readonly usersService: UsersService,
              private readonly postsService: PostsService) {}

  async create(createCommentDto: CreateCommentDto, currentUser: CurrentUserDto) {
    const { postId } = createCommentDto;

    const post = await this.postsService.findOneByIdOrThrow(postId);

    // TODO: 유저 체크

    const comment = this.commentRepository.create(createCommentDto);
    comment.content = createCommentDto.content;
    comment.postId = createCommentDto.postId;
    comment.userId = currentUser.id;

    if (createCommentDto.parentId) {
      const parentComment = await this.commentRepository.findOne({ where: { id: createCommentDto.parentId } });

      if (!parentComment) throw new NotFoundException('댓글이 존재하지 않습니다.');

      comment.parent = parentComment;
    }

    return await this.commentRepository.save(comment);
  }

  // TODO: DTO로 받아서 처리
  async update(id: number, attrs: Partial<Comment>, currentUser: CurrentUserDto) {
    const { postId } = attrs;

    const post = await this.postsService.findOneByIdOrThrow(postId);

    const comment = await this.commentRepository.findOne({ where: { id, userId: currentUser.id } });

    if (!comment) throw new NotFoundException('댓글이 존재하지 않습니다.');

    const updatedComment = Object.assign(comment, attrs);
    return await this.commentRepository.save(updatedComment);
  }

  async getComments(getCommentsDto: GetCommentsDto): Promise<PageDto<CommentResponseDto>> {
    const { page, limit, postId } = getCommentsDto;
    const offset = (page - 1) * limit;

    const [comments, totalComments ] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.children', 'children')
      .leftJoinAndSelect('children.user', 'childrenUser')
      .where('comment.postId = :postId', { postId })
      .andWhere('comment.parent IS NULL') // 대댓글만 가져옴
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const response = comments.map(comment => new CommentResponseDto(comment));
    return new PageDto(response, page, limit, totalComments);
  }

}
