import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SafePipe } from "./safe.pipe";
import { CommaSeperatePipe } from './comma-seperate.pipe';
import { DateDayPipe } from "./date-day.pipe";
import { NoSanitizePipe } from "./sanitize.pipe";
import { MessageTimePipe } from "./message-time.pipe";
import { HighlightPipe } from "./hightlight-text.pipe";
import { SearchFilterPipe } from "./search-filter.pipe";

@NgModule({
  declarations: [SafePipe, CommaSeperatePipe, DateDayPipe, NoSanitizePipe, MessageTimePipe, HighlightPipe, SearchFilterPipe],
  imports: [CommonModule],
  exports: [SafePipe, CommaSeperatePipe, DateDayPipe, NoSanitizePipe, MessageTimePipe, HighlightPipe, SearchFilterPipe],
})
export class PipeModule { }
