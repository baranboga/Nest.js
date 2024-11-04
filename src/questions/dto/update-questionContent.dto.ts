import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { QuestionContent } from "@prisma/client";
import { IsString } from "class-validator";

export class UpdateQuestionContentDto {


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isCorrect: boolean;
}
