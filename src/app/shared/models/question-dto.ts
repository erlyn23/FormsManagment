import { AnswerDto } from "./answer-dto";
import { QuestionOptionDto } from "./question-option-dto";

export interface QuestionDto{
    questionId?: number;
    formId: number;
    title: string;
    questionTypeId: number;
    questionType?: string;
    questionOptions?: QuestionOptionDto[];
    answers?: AnswerDto[];
}