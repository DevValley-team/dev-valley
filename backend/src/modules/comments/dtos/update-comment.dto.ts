import { IsString, Length, Max, Min } from "class-validator";

export class UpdateCommentDto {
  @IsString()
  @Length(1, 255)
  content: string;
}