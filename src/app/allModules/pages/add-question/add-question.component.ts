import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { AuthenticationDetails } from 'app/models/master';
import { Questionnaires, SaveQuestionnaire, QuestionnaireGroup, QuestionnaireGroupQuestion, Question, QAnswerChoice, SaveQuestionnaireGroups, SaveQuestions, QuestionsResultSet, SaveAllSelectedQuestions } from 'app/models/Questionnaire';
import { Guid } from 'guid-typescript';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { QuestionnaireService } from 'app/services/questionnaire.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AddQuestionComponent implements OnInit {

  currentUserID: Guid;
  currentUserName: string;
  currentUserRole: string;
  IsProgressBarVisibile: boolean;
  MenuItems: string[];
  AllQuestionnaire: Questionnaires[] = [];
  AllQuestionnaireGroup: QuestionnaireGroup[] = [];
  AllQuestionnaireByGroup: QuestionnaireGroup[] = [];
  AllQuestionnaireGroupQuestion: QuestionnaireGroupQuestion[] = [];
  AllQuestion: Question[] = [];
  AllQAnswerChoice: QAnswerChoice[] = [];
  AllQuestionID: any = [];
  AddedQuestions: Question[] = [];
  UnaddedQuestions: Question[] = [];
  ALLQuestionsResultSet: QuestionsResultSet;
  Questionnaire: SaveQuestionnaire = new SaveQuestionnaire();
  QuestionnaireGroup: SaveQuestionnaireGroups = new SaveQuestionnaireGroups();
  Question: SaveQuestions = new SaveQuestions();
  QuestionnaireGroupQuestion: SaveAllSelectedQuestions = new SaveAllSelectedQuestions();
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  questionFormGroup: FormGroup;
  questionnaireGroupFormGroup: FormGroup;
  searchText = '';
  selectQuestionnaireGroupID;
  selectQuestionnaireID;
  selectQuestionType;
  SelectedQuestionnaireGroup: QuestionnaireGroup;
  QuestionOptions: any = [];
  @ViewChild('txtVal') txtVal: ElementRef;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _questionnaireService: QuestionnaireService,
    private _formBuilder: FormBuilder,
  ) {
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    // this.IsProgressBarVisibile = true;

  }

  ngOnInit() {
    this.GetAllQuestionnaires();
    this.GetAllQAnswerChoice();
    // this.GetAllQuestion();
    this.GetAllQuestionnaireGroupQuestion();
    this.GetAllQuestionnaireGroup();
    // this.ResetControl();
    this.QuestionOptions = [];
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.currentUserID = this.authenticationDetails.UserID;
      this.currentUserName = this.authenticationDetails.UserName;
      this.currentUserRole = this.authenticationDetails.UserRole;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      // if (this.MenuItems.indexOf('ASN') < 0) {
      //     this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger
      //     );
      //     this._router.navigate(['/auth/login']);
      // }

    } else {
      this._router.navigate(['/auth/login']);
    }
    this.questionFormGroup = this._formBuilder.group({
      Question: [''],
      QuestionType: ['']
    });
    this.questionnaireGroupFormGroup = this._formBuilder.group({
      QuestionnaireGroup: [''],
      QuestionnaireID: [''],
      DefaultExpanded: ['']
    });
  }
  GetQuestiontype(QType: any): void {
    this.selectQuestionType = QType;
  }
  OptionEnter(value: any): void {
    this.QuestionOptions.push(value);
    this.txtVal.nativeElement.value = '';
  }
  RemoveOption(value: any): void {
    let index = this.QuestionOptions.findIndex(x => x == value);
    this.QuestionOptions.splice(index, 1);
  }
  GetAllQuestionnaires(): void {
    this._questionnaireService.GetAllQuestionnaires().subscribe(
      (data) => {
        this.AllQuestionnaire = <Questionnaires[]>data;
        console.log(this.AllQuestionnaire);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  GetAllQuestionnaireGroup(): void {
    this._questionnaireService.GetAllQuestionnaireGroup().subscribe(
      (data) => {
        this.AllQuestionnaireGroup = <QuestionnaireGroup[]>data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  GetAllQuestionnaireGroupQuestion(): void {
    this._questionnaireService.GetAllQuestionnaireGroupQuestion().subscribe(
      (data) => {
        this.AllQuestionnaireGroupQuestion = <QuestionnaireGroupQuestion[]>data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  GetAllQuestion(): void {
    this._questionnaireService.GetAllQuestion().subscribe(
      (data) => {
        this.AllQuestion = <Question[]>data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  GetAllQAnswerChoice(): void {
    this._questionnaireService.GetAllQAnswerChoice().subscribe(
      (data) => {
        this.AllQAnswerChoice = <QAnswerChoice[]>data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  SelectQuestionnaire(qrid: any): void {
    this.selectQuestionnaireID = qrid;
    this._questionnaireService.GetQuestionnaireGroupByQRID(qrid).subscribe(
      (data) => {
        this.AllQuestionnaireByGroup = <QuestionnaireGroup[]>data;
        console.log(this.AllQuestionnaireByGroup);
        if (this.AllQuestionnaireByGroup && this.AllQuestionnaireByGroup.length) {
          this.loadSelectedMenuApp(this.AllQuestionnaireByGroup[0]);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  loadSelectedMenuApp(SelectedMenuApp: QuestionnaireGroup): void {
    this.selectQuestionnaireGroupID = SelectedMenuApp.QRGID;
    this.SelectedQuestionnaireGroup = SelectedMenuApp;
    this.GetQuestionByGroupId(this.selectQuestionnaireGroupID, this.selectQuestionnaireID)
    // this.SetMenuAppValues();
  }
  GetQuestionByGroupId(QRGID: string, QRID: string): void {
    this._questionnaireService.GetQuestionByGroupId(QRGID, QRID).subscribe(
      (data) => {
        this.ALLQuestionsResultSet = <QuestionsResultSet>data;
        this.AddedQuestions = this.ALLQuestionsResultSet.AddedQuestions;
        this.UnaddedQuestions = this.ALLQuestionsResultSet.UnaddedQuestions;
        // console.log(this.ALLQuestionsResultSet);
        this.GetAllQuestion();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  SaveQuestion(): void {
    if (this.questionFormGroup.valid) {
      const Actiontype = 'Create';
      const Catagory = 'Question';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.ShowValidationErrors(this.questionFormGroup);
    }
  }
  OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Catagory: Catagory
      },
      panelClass: 'confirmation-dialog'
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (Catagory === 'Question') {
            this.CreateQuestion();
          }
        }
      });
  }

  CreateQuestion(): void {
    this.Question.QuestionName = this.questionFormGroup.get('Question').value;
    this.Question.QuestionAnsType = this.questionFormGroup.get('QuestionType').value;
    this.Question.ChoiceText = this.QuestionOptions;
    this.IsProgressBarVisibile = true;
    this._questionnaireService.SaveAllQuestions(this.Question).subscribe(
      (data) => {
        // console.log(data);
        this.GetAllQuestionnaires();
        this.GetAllQAnswerChoice();
        this.GetAllQuestion();
        this.GetAllQuestionnaireGroupQuestion();
        this.GetAllQuestionnaireGroup();
        this.ResetControl();
        this.QuestionOptions = [];
        this.notificationSnackBarComponent.openSnackBar('Question created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        this.txtVal.nativeElement.value = '';
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  ShowValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (!formGroup.get(key).valid) {
        console.log(key);
      }
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
      if (formGroup.get(key) instanceof FormArray) {
        const FormArrayControls = formGroup.get(key) as FormArray;
        Object.keys(FormArrayControls.controls).forEach(key1 => {
          if (FormArrayControls.get(key1) instanceof FormGroup) {
            const FormGroupControls = FormArrayControls.get(key1) as FormGroup;
            Object.keys(FormGroupControls.controls).forEach(key2 => {
              FormGroupControls.get(key2).markAsTouched();
              FormGroupControls.get(key2).markAsDirty();
              if (!FormGroupControls.get(key2).valid) {
                console.log(key2);
              }
            });
          } else {
            FormArrayControls.get(key1).markAsTouched();
            FormArrayControls.get(key1).markAsDirty();
          }
        });
      }
    });
  }
  ResetControl(): void {
    this.questionFormGroup.reset();
  }
  onChange(id: any, event: any) {
    // const emailFormArray = <FormArray>this.AllQuestionID;

    if (event.checked) {
      this.AllQuestionID.push(id);
      // this.AllQuestionID = emailFormArray;
    } else {
      let index = this.AllQuestionID.findIndex(x => x == id);
      this.AllQuestionID.splice(index, 1);
      // this.AllQuestionID.removeAt(index);
      // this.AllQuestionID = emailFormArray;
    }
  }
  RemoveQuestion(qid: any): void {
    this.IsProgressBarVisibile = true;
    this._questionnaireService.RemoveQuestion(qid, this.selectQuestionnaireID, this.selectQuestionnaireGroupID).subscribe(
      (data) => {
        this.GetAllQuestionnaires();
        this.GetAllQAnswerChoice();
        this.GetAllQuestion();
        this.GetAllQuestionnaireGroupQuestion();
        this.GetAllQuestionnaireGroup();
        this.ResetControl();
        this.GetQuestionByGroupId(this.selectQuestionnaireGroupID, this.selectQuestionnaireID)
        this.AllQuestionID = [];
        this.notificationSnackBarComponent.openSnackBar('Question remove successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  AddSelectedQuestions(): void {
    // this.AllQuestionID.push(this.selectQuestion);
    this.QuestionnaireGroupQuestion.QuestionnaireId = this.selectQuestionnaireID;
    this.QuestionnaireGroupQuestion.QuestionnaireGroupId = this.selectQuestionnaireGroupID;
    this.QuestionnaireGroupQuestion.ArrayOfQuestions = this.AllQuestionID;
    this.IsProgressBarVisibile = true;
    this._questionnaireService.AddSelectedQuestions(this.QuestionnaireGroupQuestion).subscribe(
      (data) => {
        this.GetAllQuestionnaires();
        this.GetAllQAnswerChoice();
        this.GetAllQuestion();
        this.GetAllQuestionnaireGroupQuestion();
        this.GetAllQuestionnaireGroup();
        this.ResetControl();
        this.GetQuestionByGroupId(this.selectQuestionnaireGroupID, this.selectQuestionnaireID)
        this.AllQuestionID = [];
        this.notificationSnackBarComponent.openSnackBar('Question add successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }
}

