import { Pipe, PipeTransform, TemplateRef } from '@angular/core';
import { column } from "../components/controls/column";
import { User } from '../models/user.model';

@Pipe({
  name: 'template'
})
export class TemplatePipe implements PipeTransform {
//returns the template for the col name. Returns null if no template is found
  transform(templateRef:TemplateRef<any>|null): TemplateRef<any>|null {
    console.log("Template ref",templateRef)
    if(templateRef){
      return templateRef
    }
    else{
      return null
    }
    
  }

}
