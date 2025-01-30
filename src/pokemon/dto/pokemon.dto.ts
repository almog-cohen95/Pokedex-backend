import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";


export class GetPokemonsQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['name', 'hp', 'power'])
  sortBy: string = 'name';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortType: string = 'asc';

  @IsOptional()
  @IsString()
  isOwn?: boolean = false;

  @IsOptional()
  @IsString()
  nameSearch?: string;

  @IsInt()
  @Min(1)
  page: number = 1;

  @IsInt()
  @Min(1)
  pageSize: number = 10;
}