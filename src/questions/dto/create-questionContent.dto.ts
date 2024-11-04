import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateQuestionContentDto{

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    questionId:number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    content:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isCorrect: boolean;

    
}