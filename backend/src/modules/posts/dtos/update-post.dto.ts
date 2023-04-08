import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsNumber()
  @IsOptional()
  categoryId: number;
}