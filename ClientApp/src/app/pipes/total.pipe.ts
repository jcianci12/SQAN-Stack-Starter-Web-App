import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'total'
})
export class TotalPipe implements PipeTransform {

  transform(hirecostperhour: number, hours: number,updatecount:number): number {

    return hirecostperhour*hours;
  }

}
