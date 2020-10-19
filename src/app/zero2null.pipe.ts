import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zero2null'
})
export class Zero2nullPipe implements PipeTransform {

  transform(value: unknown): unknown {
    return value == 0 ? null : value;
  }

}
