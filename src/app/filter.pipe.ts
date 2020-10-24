import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(objs: Array<unknown>, key, values?, map?): unknown {

    if (!values) return objs;
    if (typeof key == 'string') {
      if (Array.isArray(values)) {
        if (values.length == 0) return objs
        return objs.filter(o => {
          if (map) return o[map].filter(e => values.includes(e[key as string])).length > 0
          return values.includes(o[key as string])
        })
      }
      else {
        return objs.filter(o => {
          if (map) return o[map].filter(e => e[key as string] == values).length > 0
          return o[key as string] == values
        })
      }
    }
    if (key instanceof Array) {
      if (key.length == 0) return objs
      let result = []
      for (let k of key) {
        if (Array.isArray(values)) {
          result.push(...objs.filter(o => {
            if (map) return o[map].filter(e => values.includes(e[k])).length > 0
            return values.includes(o[k])
          }))
        }
        else {
          result.push(...objs.filter(o => {
            if (map) return o[map].filter(e => e[k] == values).length > 0
            return o[k] == values
          }))
        }
      }
      return result.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
    }

  }

}
