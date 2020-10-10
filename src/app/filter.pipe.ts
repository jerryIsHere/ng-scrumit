import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(objs: Array<unknown>, key: string, values?): unknown {
    if(!values)return objs;
    if (Array.isArray(values)) {
      return objs.filter(o => values.includes(o[key]))
    }
    else{
      return objs.filter(o => o[key] == values)
    }
  }

}
