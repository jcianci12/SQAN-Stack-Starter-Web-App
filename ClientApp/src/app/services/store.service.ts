import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, Subject } from 'rxjs';
import { Client, StoreModel } from '../api/Client';
import { AuthService } from './auth.service';
import { EndpointBase } from '../api/endpoint-base.service';

@Injectable({
  providedIn: 'root'
})


export class StoresOwnedService {
  public storesownedsubject = new Subject<Array<StoreModel>>();
  public loadingownedstores = new Subject<boolean>();
  constructor(
    private Client: Client,
    private snackbar: MatSnackBar,
    private epb: EndpointBase,
    private auth: AuthService
  ) {
  }

  updatestores(store: StoreModel) {
    this.loadingownedstores.next(true)
    console.log(store)
    if (store.id == null) {
      //create the store
      this.Client.storePOST(store).subscribe(success => {
        console.log("success:", success)
        this.snackbar.open("Store created!")
        this.getmyownedstores()


      })
    }
    else {
      //edit the store
      this.Client.storePUT(store.id, store).subscribe(response => {
        console.log("success:", response)
        this.snackbar.open("Store updated!")

        this.getmyownedstores()
      })
    }
  }

  removestores(store: StoreModel) {
    this.loadingownedstores.next(true)
    this.Client.storeDELETE(store.id!).subscribe(s => {
      this.snackbar.open("Store removed!")
      this.getmyownedstores()
    })
  }

  getmyownedstores() {
    this.Client.getMyOwnedStores(this.auth.currentUser.userName).subscribe(i => {
      console.log(i)
      this.storesownedsubject.next(i)
      this.loadingownedstores.next(false)
    })
  }
}
