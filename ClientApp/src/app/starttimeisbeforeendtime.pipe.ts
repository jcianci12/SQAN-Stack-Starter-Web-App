import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'starttimeisbeforeendtime'
})
export class StarttimeisbeforeendtimePipe implements PipeTransform {

  transform(start: Date, end:Date,updatecount:number): boolean {
    let v = moment(start).isBefore(end)
    console.log(start,end,v,updatecount)
    return v;
  }

}
