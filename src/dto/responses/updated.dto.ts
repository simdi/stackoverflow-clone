import { ApiProperty } from "@nestjs/swagger";

export class QuestionVoteDTO {
  @ApiProperty({ type: Boolean })
  success: boolean;
};
