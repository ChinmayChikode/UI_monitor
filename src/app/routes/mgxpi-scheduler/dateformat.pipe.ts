import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateformat'
})
export class DateformatPipe implements PipeTransform {
  datePipe: any;
  date:Date;

  transform(value: any, execDateTimeOrg: String): any {
    
    if(value===execDateTimeOrg)
    {
      return  this.date=this.datePipe.transform(execDateTimeOrg, 'yyyy-MM-dd, h:mm:ss')
    }
    

  }

}
