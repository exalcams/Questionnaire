import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { AuthenticationDetails } from 'app/models/master';
import { Questionnaires, SaveQuestionnaire, QuestionnaireGroup, QuestionnaireGroupQuestion, Question, QAnswerChoice, SaveQuestionnaireGroups, QuestionsResultSet, QuestionnaireResultSet, SaveAllSelectedQuestions, QuestionID } from 'app/models/Questionnaire';
import { Guid } from 'guid-typescript';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { QuestionnaireService } from 'app/services/questionnaire.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class QuestionnaireComponent implements OnInit {

  // SelectedUser: UserWithRole;
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
  AddedQuestions: Question[] = [];
  UnaddedQuestions: Question[] = [];
  AllQAnswerChoice: QAnswerChoice[] = [];
  AllQuestionID: any = [];
  ALLQuestionsResultSet: QuestionsResultSet;
  AllQuestionnaireResultSet: QuestionnaireResultSet = new QuestionnaireResultSet();
  Questionnaire: SaveQuestionnaire = new SaveQuestionnaire();
  QuestionnaireGroup: SaveQuestionnaireGroups = new SaveQuestionnaireGroups();
  QuestionnaireGroupQuestion: SaveAllSelectedQuestions = new SaveAllSelectedQuestions();
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  questionnaireFormGroup: FormGroup;
  questionnaireGroupFormGroup: FormGroup;
  AddQuestionGroup: FormGroup;
  searchText = '';
  selectQuestionnaireGroupID;
  selectQuestionnaireID;
  selectQuestion;
  SelectedQuestionnaireGroup: QuestionnaireGroup;
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
    this.AllQuestionID = [];
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
    this.questionnaireFormGroup = this._formBuilder.group({
      QRText: [''],
    });
    this.questionnaireGroupFormGroup = this._formBuilder.group({
      QuestionnaireGroup: [''],
      QuestionnaireID: [''],
      DefaultExpanded: ['']
    });
    this.AddQuestionGroup = new FormGroup({
      question: new FormArray([
        new FormControl(true),
        new FormControl(false),
      ])
    })
  }
  GetAllQuestionnaires(): void {
    this._questionnaireService.GetAllQuestionnaires().subscribe(
      (data) => {
        this.AllQuestionnaire = <Questionnaires[]>data;
        // console.log(this.AllQuestionnaire);
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
        console.log(this.AllQuestionnaireGroup);
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
        // console.log(this.AllQuestion);
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
        // console.log(this.AllQuestionnaireByGroup);
        if (this.AllQuestionnaireByGroup && this.AllQuestionnaireByGroup.length) {
          this.loadSelectedMenuApp(this.AllQuestionnaireByGroup[0]);
        }
        // this.GetQuestionnaireResultSetByQRID(qrid);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  loadSelectedMenuApp(SelectedMenuApp: QuestionnaireGroup): void {
    this.selectQuestionnaireGroupID = SelectedMenuApp.QRGID;
    this.SelectedQuestionnaireGroup = SelectedMenuApp;
    // this.SetMenuAppValues();
    this.GetQuestionByGroupId(this.selectQuestionnaireGroupID, this.selectQuestionnaireID)

  }
  GetQuestionByGroupId(QRGID: string, QRID: string): void {
    this._questionnaireService.GetQuestionByGroupId(QRGID, QRID).subscribe(
      (data) => {
        this.ALLQuestionsResultSet = <QuestionsResultSet>data;
        this.AddedQuestions = this.ALLQuestionsResultSet.AddedQuestions;
        this.UnaddedQuestions = this.ALLQuestionsResultSet.UnaddedQuestions;
        console.log(this.ALLQuestionsResultSet);
        this.GetAllQuestion();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  GetQuestionnaireResultSetByQRID(QRGID: string): void {
    this._questionnaireService.GetQuestionnaireResultSetByQRID(QRGID, this.currentUserID).subscribe(
      (data) => {
        this.AllQuestionnaireResultSet = <QuestionnaireResultSet>data;
        this.AllQuestion = this.AllQuestionnaireResultSet.Questions;
        // console.log(this.AllQuestionnaireResultSet);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  SaveQuestionnaire(): void {
    if (this.questionnaireFormGroup.valid) {
      const Actiontype = 'Create';
      const Catagory = 'Questionnaire';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.ShowValidationErrors(this.questionnaireFormGroup);
    }
  }
  SaveQuestionnaireGroup(): void {
    if (this.questionnaireGroupFormGroup.valid) {
      const Actiontype = 'Create';
      const Catagory = 'Questionnaire Group';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.ShowValidationErrors(this.questionnaireGroupFormGroup);
    }
  }
  CountryOfOriginSelected(event): void {

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
          if (Catagory === 'Questionnaire') {
            this.CreateQuestionnaire();
          }
          if (Catagory === 'Questionnaire Group') {
            this.CreateQuestionnaireGroup();
          }
        }
      });
  }
  CreateQuestionnaireGroup(): void {
    this.QuestionnaireGroup.QRGText = this.questionnaireGroupFormGroup.get('QuestionnaireGroup').value;
    this.QuestionnaireGroup.QRID = this.questionnaireGroupFormGroup.get('QuestionnaireID').value;
    const defaultE = this.questionnaireGroupFormGroup.get('DefaultExpanded').value;
    this.QuestionnaireGroup.QRGSortPriority = 1;
    if (defaultE == 1) {
      this.QuestionnaireGroup.DefaultExpanded = true;
    }
    else {
      this.QuestionnaireGroup.DefaultExpanded = false;
    }
    this.IsProgressBarVisibile = true;
    this._questionnaireService.SaveQuestionnaireGroup(this.QuestionnaireGroup).subscribe(
      (data) => {
        // console.log(data);
        this.GetAllQuestionnaires();
        this.GetAllQAnswerChoice();
        this.GetAllQuestion();
        this.GetAllQuestionnaireGroupQuestion();
        this.GetAllQuestionnaireGroup();
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('Questionnaire Group created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  CreateQuestionnaire(): void {
    this.Questionnaire.QRText = this.questionnaireFormGroup.get('QRText').value;
    this.IsProgressBarVisibile = true;
    this._questionnaireService.SaveQuestionnaire(this.Questionnaire).subscribe(
      (data) => {
        // console.log(data);
        this.GetAllQuestionnaires();
        this.GetAllQAnswerChoice();
        this.GetAllQuestion();
        this.GetAllQuestionnaireGroupQuestion();
        this.GetAllQuestionnaireGroup();
        this.ResetControl();
        this.notificationSnackBarComponent.openSnackBar('Questionnaire created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  // ShowValidationErrors(): void {
  //   Object.keys(this.questionnaireFormGroup.controls).forEach(key => {
  //     this.questionnaireFormGroup.get(key).markAsTouched();
  //     this.questionnaireFormGroup.get(key).markAsDirty();
  //   });

  // }
  AddQuestions(): void {
    this._router.navigate(['/pages/addQuestions']);
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
    this.questionnaireFormGroup.reset();
    this.questionnaireGroupFormGroup.reset();
  }
  // onChange(event: any): void {
  //   this.selectQuestion = event;
  // }
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
    this._questionnaireService.RemoveQuestion(qid,this.selectQuestionnaireID,this.selectQuestionnaireGroupID).subscribe(
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
