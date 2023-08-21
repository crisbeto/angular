// #docregion
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'initCaps',
    standalone: true
})
export class InitCapsPipe implements PipeTransform {
  transform = (value: string) => value;
}
