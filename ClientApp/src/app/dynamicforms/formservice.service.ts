import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UntypedFormGroup, Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormserviceService {
  private fd = new BehaviorSubject({});
  currentFormData = this.fd.asObservable();
  constructor(

  ) { }

  updateForm(data: UntypedFormGroup) {
    this.fd.next(data)
    
  }

}

