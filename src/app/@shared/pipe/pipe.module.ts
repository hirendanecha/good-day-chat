import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SafePipe } from "./safe.pipe";
import { CommaSeperatePipe } from './comma-seperate.pipe';
import { DateDayPipe } from "./date-day.pipe";
import { NoSanitizePipe } from "./sanitize.pipe";
import { MessageTimePipe } from "./message-time.pipe";

@NgModule({
  declarations: [SafePipe, CommaSeperatePipe, DateDayPipe, NoSanitizePipe, MessageTimePipe],
  imports: [CommonModule],
  exports: [SafePipe, CommaSeperatePipe, DateDayPipe, NoSanitizePipe, MessageTimePipe],
})
export class PipeModule { }
