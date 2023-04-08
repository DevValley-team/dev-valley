import { IsString } from "class-validator";

export class CreateCategoryDto {
  // TODO: 글자 수 제한
  @IsString()
  name: string;
}