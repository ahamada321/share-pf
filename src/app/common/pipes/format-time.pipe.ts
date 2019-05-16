import { PipeTransform, Pipe } from "@angular/core"
import * as moment from "moment"

@Pipe({
    name: 'formatTime'
})

export class FormatTimePipe implements PipeTransform {
    transform(value: string): string {
        return moment(value).format('HH:mm')
    }
}
