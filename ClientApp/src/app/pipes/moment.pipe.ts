import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DurationInputArg2 } from 'moment';
import { type } from 'os';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: Date, action: action, amount: number,unit:DurationInputArg2): Date {

    switch (action) {
      case "add": {
        return moment(value).add(amount, unit).toDate();
      }
      case "subtract": {
        return moment(value).subtract(amount, unit).toDate()
      }
    }
  }
}
export type action = "add" | "subtract"
