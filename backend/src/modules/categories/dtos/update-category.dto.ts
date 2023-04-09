import { IsNumber, IsString } from "class-validator";

export class UpdateCategoryDto {
  @IsNumber()
  id: number;

  // TODO: 글자 수 제한
  @IsString()
  name: string;
}