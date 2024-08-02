import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})




export class TablepasteserviceService {
  // localstorage 
   private dataSource = new BehaviorSubject<any>("")
   currentData = this.dataSource.asObservable();

  constructor(


  ) {
    //this.fetchContacts() 
  }

  public pushDataToTable(tabledata: any,row:number,cell:number) {

    this.dataSource.next(tabledata)
    console.log("tablepaste service data is:")
    console.log(this.currentData)
  }

  // public updateData(person: Person) {
  //   this.dataSource.next(person)
  // }
}
