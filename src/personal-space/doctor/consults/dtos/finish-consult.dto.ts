import { IsString } from 'class-validator';

export class FinishConsultDto {
  @IsString()
  finishRecomendations: string;
}
