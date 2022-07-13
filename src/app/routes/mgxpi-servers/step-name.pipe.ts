import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stepName'
})
export class StepNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
