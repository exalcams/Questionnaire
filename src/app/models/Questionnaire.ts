
import { Guid } from 'guid-typescript';

export class SaveQuestionnaire {
    QRText: string;
    IsInActive: boolean;
}
export class Questionnaires {
    QRID: number;
    QRText: string;
    IsInActive: string;
}
export class QuestionnaireGroup {
    QRGID: number;
    QRID: number;
    Language: string;
    QRGText: string;
    QRGLText: string;
    QRGSortPriority: string;
    DefaultExpanded: string;
}
export class QuestionnaireGroupQuestion {
    QRID: number;
    QRGID: number;
    QID: number;
    IsMandatory: boolean;
    SortPriority: number;
}
export class Question {
    QID: number;
    Language: string;
    QText: string;
    QLText: string;
    QAnsType: string;
}
export class QuestionsResultSet {
    AddedQuestions: Question[];
    UnaddedQuestions: Question[];
}

export class QAnswerChoice {
    ChoiceID: number;
    QID: number;
    Language: string;
    ChoiceText: string;
    IsDefault: boolean;
}

export class Answers {
    AppID: number;
    AppUID: number;
    QRID: number;
    QID: number;
    Answer: string;
    AnsweredBy: Guid;
    AnswredOn: Date;
}
export class QuestionnaireResultSet {
    Questionnaire: Questionnaires[];
    QuestionnaireGroup: QuestionnaireGroup[];
    QuestionnaireGroupQuestion: QuestionnaireGroupQuestion[];
    Questions: Question[];
    QuestionAnswerChoices: QAnswerChoice[];
    Answers: Answers[];
}
export class SaveQuestions {
    ChoiceText: any;
    QuestionName: string;
    QuestionAnsType: string;
    QuestionLongText: string;
    Language: string;
    IsMandatory: string;
}
export class SaveAllSelectedQuestions {
    QuestionnaireId: number;
    QuestionnaireGroupId: number;
    ArrayOfQuestions: any;
    IsMandatory: boolean;
    SortPriority: number;
}
export class QuestionID {
    id: string;
}
export class SaveQuestionnaireGroups {
    QRID: number;
    Language: string;
    QRGText: string;
    QRGLText: string;
    QRGSortPriority: number;
    DefaultExpanded: boolean;
}