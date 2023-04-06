import { IsNumber, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  content: string;

  @IsString()
  title: string;

  @IsNumber()
  categoryId: number;
}