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
import { UpdateCommentDto } from "./dtos/update-comment.dto";

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>,
              @InjectRepository(CommentLike) private commentLikeRepository: Repository<CommentLike>,
              private readonly usersService: UsersService,
              private readonly postsService: PostsService) {}

  async create(createCommentDto: CreateCommentDto, currentUser: CurrentUserDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    comment.content = createCommentDto.content;
    comment.postId = createCommentDto.postId;
    comment.userId = currentUser.id;

    if (createCommentDto.parentId) {
      const parentComment = await this.commentRepository.findOne({ where: { id: createCommentDto.parentId } });

      if (!parentComment) throw new NotFoundException('Parent comment not found');

      comment.parent = parentComment;
    }

    return await this.commentRepository.save(comment);
  }

  async getComments(getCommentsDto: GetCommentsDto): Promise<Comment[]> {
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

    return comments;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, currentUser: CurrentUserDto): Promise<boolean> {
    const comment = await this.commentRepository.createQueryBuilder('comment')
      .select(['comment.id', 'user.id'])
      .innerJoin('comment.user', 'user')
      .where('comment.id = :id', { id })
      .getOne();

    if (!comment) throw new NotFoundException('Comment not found');

    if (currentUser.id !== comment.user.id) throw new NotFoundException('You are not allowed to update this comment.');

    const updatedComment = Object.assign(comment, updateCommentDto);
    const result = await this.commentRepository.save(updatedComment);
    return !!result;
  }

  async
}
