import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsString()
  content: string;

  @IsNumber()
  postId: number;
}