import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressiveexportService {


  public cases_currentexportrangeindex = new Subject<number>()
  public cases_currentuploadindex = new Subject<number>()
  public cases_uploadcountsubject = new Subject<number>()
  public cases_uploadcount: number


  public contacts_currentexportrangeindex = new Subject<number>()
  public contacts_currentuploadindex = new Subject<number>()
  public contacts_uploadcountsubject = new Subject<number>()
  public contacts_uploadcount: number

  public labresults_currentexportrangeindex = new Subject<number>()
  public labresults_currentuploadindex = new Subject<number>()
  public labresults_uploadcountsubject = new Subject<number>()
  public labresults_uploadcount: number
  constructor() { }
}
