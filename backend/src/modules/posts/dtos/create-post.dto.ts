import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
  @ApiProperty({ type: String, example: 'Hello World!'})
  @IsString()
  content: string;

  @ApiProperty({ type: String, example: 'Hello World!'})
  @IsString()
  title: string;

  @ApiProperty({ type: String, example: '자유게시판' })
  @IsString()
  categoryName: string;
}