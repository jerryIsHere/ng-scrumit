import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flatMap',
  pure: false
})
export class FlatMapPipe implements PipeTransform {

  transform(objs: Array<unknown>, key): unknown {
    let result = []
    objs.map(o => o[key]).forEach(e => result.push(...e))
    return result;
  }

}
