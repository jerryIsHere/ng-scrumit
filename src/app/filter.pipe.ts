import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(objs: Array<unknown>, key: string, values): unknown {
    if (typeof values == 'number') {
      return objs.filter(o => o[key] == values)
    }
    if (Array.isArray(values)) {
      return objs.filter(o => values.includes(o[key]))
    }
    return []
  }

}
