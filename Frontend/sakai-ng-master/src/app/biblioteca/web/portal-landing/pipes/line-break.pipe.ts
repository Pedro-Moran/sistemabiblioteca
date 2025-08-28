import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreak'
})
export class LineBreakPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return (value ?? '').replace(/\\r\\n|\\n|\\r|\/n/g, '<br/>');
  }
}
