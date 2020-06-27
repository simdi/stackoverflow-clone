import { ApiProperty } from "@nestjs/swagger";

export class FindDTO {
  @ApiProperty({ type: Array })
  docs: any[];
  @ApiProperty({ type: Number })
  totalDocs: number;
  @ApiProperty({ type: Number })
  limit: number;
  @ApiProperty({ type: Number })
  totalPages: number;
  @ApiProperty({ type: Number })
  page: number;
  @ApiProperty({ type: Number })
  pagingCounter: number;
  @ApiProperty({ type: Boolean })
  hasPrevPage: boolean;
  @ApiProperty({ type: Boolean })
  hasNextPage: boolean;
  @ApiProperty({ type: String })
  prevPage: string;
  @ApiProperty({ type: String })
  nextPage: string;
};