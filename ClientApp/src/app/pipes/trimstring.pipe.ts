import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'trim'
})
@Injectable()
export class TrimPipe implements PipeTransform {

    transform(string: string): string {


return string.substring(0,15) + "..."

    }
}


