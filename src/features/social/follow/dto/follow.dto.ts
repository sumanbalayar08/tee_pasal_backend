import { IsString } from 'class-validator';

export class FollowDto {
  @IsString()
  followingId: string;
}
