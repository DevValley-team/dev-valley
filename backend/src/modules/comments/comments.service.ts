import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from "typeorm";
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
import { plainToInstance } from "class-transformer";

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>,
              @InjectRepository(CommentLike) private commentLikeRepository: Repository<CommentLike>,
              private readonly usersService: UsersService,
              private readonly postsService: PostsService,
              private dataSource: DataSource) {}

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
    updatedComment.updatedAt = new Date();
    return await this.commentRepository.save(updatedComment);
  }

  async findOneByIdOrThrow(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');

    return comment;
  }

  async getComments(getCommentsDto: GetCommentsDto, currentUser: CurrentUserDto): Promise<PageDto<CommentResponseDto>> {
    const { page, limit, postId } = getCommentsDto;
    const offset = (page - 1) * limit;

    const [comments, totalComments ] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.children', 'children')
      .leftJoinAndSelect('children.user', 'childrenUser')
      .where('comment.postId = :postId', { postId })
      .andWhere('comment.parent IS NULL')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    let response;
    if(currentUser) {
      const commentIds: number[] = comments.map(comment => comment.id);
      const commentLikes = await this.commentLikeRepository
        .createQueryBuilder('commentLike')
        .where('commentLike.comment_id IN (:...commentIds)', { commentIds })
        .andWhere('commentLike.user_id = :userId', { userId: currentUser.id })
        .getMany();

      response = comments.map(comment => {
        const result = new CommentResponseDto(comment)
        result.isLiked = commentLikes.some(commentLike => commentLike.id === comment.id);
        return result;
      });
    } else {
      response = comments.map(comment => new CommentResponseDto(comment));
    }

    return new PageDto(response, page, limit, totalComments);
  }

  async likeComment(id: number, currentUser: CurrentUserDto): Promise<CommentResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const comment = await this.findOneByIdOrThrow(id);

      const commentLikeCount = await queryRunner.manager.getRepository(CommentLike)
        .createQueryBuilder('commentLike')
        .where('commentLike.comment_id = :commentId', { commentId: id })
        .andWhere('commentLike.user_id = :userId', { userId: currentUser.id })
        .getCount();

      if (commentLikeCount > 0) throw new ConflictException('이미 좋아요를 눌렀습니다.');

      const newCommentLike = queryRunner.manager.create(CommentLike, { comment, user: currentUser });
      await queryRunner.manager.save(CommentLike, newCommentLike);

      await queryRunner.manager.increment(Comment, { id }, 'likeCount', 1);

      const updatedComment = await this.commentRepository.findOneBy({ id });

      await queryRunner.commitTransaction();
      return plainToInstance(CommentResponseDto, updatedComment, { strategy: 'excludeAll' });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async unlikeComment(id: number, currentUser: CurrentUserDto) {
    const comment = await this.findOneByIdOrThrow(id);

    const commentLikeCount = await this.commentLikeRepository.createQueryBuilder('commentLike')
      .where('commentLike.comment_id = :commentId', { commentId: id })
      .andWhere('commentLike.user_id = :userId', { userId: currentUser.id })
      .getCount();

    if (commentLikeCount === 0) throw new ConflictException('좋아요를 누르지 않았습니다.');

    await this.commentRepository.decrement({ id }, 'likeCount', 1);

    return await this.commentLikeRepository.delete({ comment, user: currentUser });
  }

}
