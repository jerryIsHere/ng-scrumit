import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(objs: Array<unknown>, key, values?): unknown {
    if (!values) return objs;
    if (typeof key == 'string') {
      if (Array.isArray(values)) {
        return objs.filter(o => values.includes(o[key as string]))
      }
      else {
        return objs.filter(o => o[key as string] == values)
      }
    }
    if (key instanceof Array) {
      let result = []
      for (let k of key) {
        if (Array.isArray(values)) {
          result.push(...objs.filter(o => values.includes(o[k])))
        }
        else {
          result.push(...objs.filter(o => o[k] == values))
        }
      }
      return result.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
    }

  }

}
