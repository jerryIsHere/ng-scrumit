import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(objs: Array<unknown>, key: string, values?): unknown {
    if (!values || values == '') return objs;

    return objs.filter(o => (o[key] as string).includes(values))

  }

}
