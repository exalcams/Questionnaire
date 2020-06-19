import { Subject, throwError, Observable } from 'rxjs';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Questionnaires, QuestionnaireGroup, QuestionnaireResultSet, QuestionnaireGroupQuestion, Question, QuestionsResultSet, QAnswerChoice, Answers, SaveQuestions, SaveAllSelectedQuestions, SaveQuestionnaireGroups, SaveQuestionnaire } from 'app/models/Questionnaire';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
    providedIn: 'root'
})
export class QuestionnaireService {

    baseAddress: string;
    NotificationEvent: Subject<any>;

    GetNotification(): Observable<any> {
        return this.NotificationEvent.asObservable();
    }

    TriggerNotification(eventName: string): void {
        this.NotificationEvent.next(eventName);
    }

    constructor(private _httpClient: HttpClient, private _authService: AuthService) {
        this.baseAddress = _authService.baseAddress;
        this.NotificationEvent = new Subject();
    }

    // Error Handler
    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error || error.message || 'Server Error');
    }

    GetAllQuestionnaires(): Observable<Questionnaires[] | string> {
        return this._httpClient.get<Questionnaires[]>(`${this.baseAddress}questionnaireapi/Questionnaire/GetAllQuestionnaires`)
            .pipe(catchError(this.errorHandler));
    }
    GetQuestionnaireResultSetByQRID(QRID:string,userId:any): Observable<QuestionnaireResultSet | string> {
        return this._httpClient.get<QuestionnaireResultSet>(`${this.baseAddress}questionnaireapi/Questionnaire/GetQuestionnaireResultSetByQRID?QRID=${QRID}&userId=${userId}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllQuestionnaireGroup(): Observable<QuestionnaireGroup[] | string> {
        return this._httpClient.get<QuestionnaireGroup[]>(`${this.baseAddress}questionnaireapi/Questionnaire/GetAllQuestionnaireGroup`)
            .pipe(catchError(this.errorHandler));
    }
    GetQuestionnaireGroupByQRID(QRID:string): Observable<QuestionnaireGroup[] | string> {
        return this._httpClient.get<QuestionnaireGroup[]>(`${this.baseAddress}questionnaireapi/Questionnaire/GetQuestionnaireGroupByQRID?QRID=${QRID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllQuestionnaireGroupQuestion(): Observable<QuestionnaireGroupQuestion[] | string> {
        return this._httpClient.get<QuestionnaireGroupQuestion[]>(`${this.baseAddress}questionnaireapi/Questionnaire/GetAllQuestionnaireGroupQuestion`)
            .pipe(catchError(this.errorHandler));
    }
    GetQuestionnaireGroupQuestionByID(QRID:string,QRGID:string): Observable<QuestionnaireGroupQuestion[] | string> {
        return this._httpClient.get<QuestionnaireGroupQuestion[]>(`${this.baseAddress}questionnaireapi/Questionnaire/GetQuestionnaireGroupQuestionByID?QRID=${QRID}&QRGID=${QRGID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllQuestion(): Observable<Question[] | string> {
        return this._httpClient.get<Question[]>(`${this.baseAddress}questionnaireapi/Questionnaire/GetAllQuestion`)
            .pipe(catchError(this.errorHandler));
    }
    GetQuestionByID(QID:string): Observable<Question[] | string> {
        return this._httpClient.get<Question[]>(`${this.baseAddress}questionnaireapi/Questionnaire/GetQuestionByID?QID=${QID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetQuestionByGroupId(QRGID:string,QRID:string): Observable<QuestionsResultSet | string> {
        return this._httpClient.get<QuestionsResultSet>(`${this.baseAddress}questionnaireapi/Questionnaire/GetQuestionByGroupId?QRGID=${QRGID}&QRID=${QRID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllQAnswerChoice(): Observable<QAnswerChoice[] | string> {
        return this._httpClient.get<QAnswerChoice[]>(`${this.baseAddress}questionnaireapi/Questionnaire/GetAllQAnswerChoice`)
            .pipe(catchError(this.errorHandler));
    }
    GetQAnswerChoiceByQID(QID:string): Observable<QAnswerChoice[] | string> {
        return this._httpClient.get<QAnswerChoice[]>(`${this.baseAddress}questionnaireapi/Questionnaire/GetQAnswerChoiceByQID?QID=${QID}`)
            .pipe(catchError(this.errorHandler));
    }
    RemoveQuestion(QID:string,QRID:string,QRGID:string): Observable<Question[] | string> {
        return this._httpClient.get<Question[]>(`${this.baseAddress}questionnaireapi/Questionnaire/RemoveQuestion?QID=${QID}&QRID=${QRID}&QRGID=${QRGID}`)
            .pipe(catchError(this.errorHandler));
    }
    SaveAnswers(AnswerList: Answers[]): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}questionnaireapi/Questionnaire/SaveAnswers`,
        AnswerList,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    DeleteAllunSelectedCheckBox(DelAnswerList: Answers[]): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}questionnaireapi/Questionnaire/DeleteAllunSelectedCheckBox`,
        DelAnswerList,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    SaveAllQuestions(QuestionData: SaveQuestions): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}questionnaireapi/Questionnaire/SaveAllQuestions`,
        QuestionData,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    AddSelectedQuestions(SaveData: SaveAllSelectedQuestions): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}questionnaireapi/Questionnaire/AddSelectedQuestions`,
        SaveData,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    SaveQuestionnaire(QuestionnaireValues: SaveQuestionnaire): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}questionnaireapi/Questionnaire/SaveQuestionnaire`,
        QuestionnaireValues,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    SaveQuestionnaireGroup(SaveQuestionnaireGrp: SaveQuestionnaireGroups): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}questionnaireapi/Questionnaire/SaveQuestionnaireGroup`,
        SaveQuestionnaireGrp,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            }
            ).pipe(catchError(this.errorHandler));
    }
}