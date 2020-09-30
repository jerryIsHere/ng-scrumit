import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemplateUtilityService {

  constructor() { }
  filter(objs, key, values) {
    if (typeof values == 'number') {
      return objs.filter(o => o[key] == values)
    }
    if (Array.isArray(values)) {
      return objs.filter(o => values.includes(o[key]))
    }
    return []
  }
}
