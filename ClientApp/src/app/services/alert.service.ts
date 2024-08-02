
import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpResponseBase } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { Utilities } from '../services/utilities';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../components/alertdialog/alertdialog.component';



@Injectable()
export class AlertService {
  constructor(private _snackbar: MatSnackBar,private dialog:MatDialog) {

  }
  private messages = new Subject<AlertCommand>();
  private dialogs = new Subject<AlertDialog>();

  private loadingMessageTimeoutId: any;



  showDialog(message: string): void;
  showDialog(message: string, type: DialogType, okCallback: (val?: any) => any): void;
  showDialog(message: string, type: DialogType, okCallback?: (val?: any) => any, cancelCallback?: () => any, okLabel?: string, cancelLabel?: string, defaultValue?: string): void;
  showDialog(message: string, type?: DialogType, okCallback?: (val?: any) => any, cancelCallback?: () => any, okLabel?: string, cancelLabel?: string, defaultValue?: string): void {
    if (!type) {
      type = DialogType.alert;
    }
  
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      data: {
        message: message,
        type: type,
        okCallback: okCallback,
        cancelCallback: cancelCallback,
        okLabel: okLabel,
        cancelLabel: cancelLabel,
        defaultValue: defaultValue
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Handle the result of the dialog if needed
      console.log('Dialog was closed with result:', result);
    });
  }



  showMessage(summary: string): void;
  showMessage(summary: string, detail: string, severity: MessageSeverity): void;
  showMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity): void;
  showMessage(response: HttpResponseBase, ignoreValue_useNull: string, severity: MessageSeverity): void;
  showMessage(data: any, separatorOrDetail?: string, severity?: MessageSeverity): void {

    if (!severity) {
      severity = MessageSeverity.default;
    }

    if (data instanceof HttpResponseBase) {
      data = Utilities.getHttpResponseMessages(data);
      separatorOrDetail = Utilities.captionAndMessageSeparator;
    }

    if (data instanceof Array) {
      for (const message of data) {
        const msgObject = Utilities.splitInTwo(message, separatorOrDetail!);

        this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, false);
      }
    } else {
      this.showMessageHelper(data, separatorOrDetail!, severity, false);
    }
  }


  showStickyMessage(summary: string): void;
  showStickyMessage(summary: string, detail: string, severity: MessageSeverity, error?: any): void;
  showStickyMessage(summary: string, detail: string, severity: MessageSeverity, error?: any, onRemove?: () => any): void;
  showStickyMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity): void;
  showStickyMessage(response: HttpResponseBase, ignoreValue_useNull: string, severity: MessageSeverity): void;
  showStickyMessage(data: string | string[] | HttpResponseBase, separatorOrDetail?: string, severity?: MessageSeverity, error?: any, onRemove?: () => any): void {

    if (!severity) {
      severity = MessageSeverity.default;
    }

    if (data instanceof HttpResponseBase) {
      data = Utilities.getHttpResponseMessages(data);
      separatorOrDetail = Utilities.captionAndMessageSeparator;
    }


    if (data instanceof Array) {
      for (const message of data) {
        const msgObject = Utilities.splitInTwo(message, separatorOrDetail!);

        this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, true);
      }
    } else {

      if (error) {

        const msg = `Severity: "${MessageSeverity[severity]}", Summary: "${data}", Detail: "${separatorOrDetail}", Error: "${Utilities.safeStringify(error)}"`;

        switch (severity) {
          case MessageSeverity.default:
            this.logInfo(msg);
            break;
          case MessageSeverity.info:
            this.logInfo(msg);
            break;
          case MessageSeverity.success:
            this.logMessage(msg);
            break;
          case MessageSeverity.error:
            this.logError(msg);
            break;
          case MessageSeverity.warn:
            this.logWarning(msg);
            break;
          case MessageSeverity.wait:
            this.logTrace(msg);
            break;
        }
      }

      this.showMessageHelper(data, separatorOrDetail!, severity, true, onRemove);
    }
  }

  private showMessageHelper(summary: string, detail: string, severity: MessageSeverity, isSticky: boolean, onRemove?: () => any) {

    const alertCommand: AlertCommand = {
      operation: isSticky ? 'add_sticky' : 'add',
      message: { severity, summary, detail },
      onRemove
    };






    this._snackbar.open(alertCommand.message!.summary, alertCommand.message!.detail, {
      duration: 2000,
    })

    this.messages.next(alertCommand);
  }

  resetStickyMessage() {
    this.messages.next({ operation: 'clear' });
  }

  startLoadingMessage(message = 'Loading...', caption = '') {
    clearTimeout(this.loadingMessageTimeoutId);

    this.loadingMessageTimeoutId = setTimeout(() => {
      this.showStickyMessage(caption, message, MessageSeverity.wait);
    }, 1000);
  }

  stopLoadingMessage() {
    clearTimeout(this.loadingMessageTimeoutId);
    this.resetStickyMessage();
  }



  logDebug(msg: any) {
    console.debug(msg);
  }

  logError(msg: string) {
    console.error(msg);
  }

  logInfo(msg: string) {
    console.info(msg);
  }

  logMessage(msg: string) {
    console.log(msg);
  }

  logTrace(msg: string) {
    console.trace(msg);
  }

  logWarning(msg: string) {
    console.warn(msg);
  }

  getDialogEvent(): Observable<AlertDialog> {
    return this.dialogs.asObservable();
  }

  getMessageEvent(): Observable<AlertCommand> {
    return this.messages.asObservable();
  }
}


// ******************** Dialog ********************//
export class AlertDialog {
  constructor(
    public message: string,
    public type: DialogType,
    public okCallback: (val?: any) => any,
    public cancelCallback: () => any,
    public defaultValue: string,
    public okLabel: string,
    public cancelLabel: string) {

  }
}

export enum DialogType {
  alert,
  confirm,
  prompt
}
// ******************** End ********************//


// ******************** Growls ********************//
export class AlertCommand {
  constructor(
    public operation: 'clear' | 'add' | 'add_sticky',
    public message?: AlertMessage,
    public onRemove?: () => any) { }
}

export class AlertMessage {
  constructor(
    public severity: MessageSeverity,
    public summary: string,
    public detail: string) { }
}

export enum MessageSeverity {
  default,
  info,
  success,
  error,
  warn,
  wait
}
// ******************** End ********************//


export class SnackBarOverviewExample {
  constructor(public _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
