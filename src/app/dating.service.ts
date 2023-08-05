import { Injectable } from '@angular/core';
import {ShiftsService} from "./shifts.service";
import {Person, Position, Shift, ShiftType} from "./models";

@Injectable({
  providedIn: 'root'
})
export class DatingService {
  currentMonth: number = 0
  currentYear: number = 0;
  shifts: Shift[] = [];
  calendarDays: any = [];
  closed = false;

  constructor(public shiftsService: ShiftsService) {

  }

  toggleClose() {
    this.closed = !this.closed;
  }
  changeShift(date: Date, shiftType: ShiftType, position: Position, toPerson: Person) {
    if(this.closed) {
      return false;
    }
    const shift =
      this.shifts.find(d => d.date.getTime() === date.getTime() && d.shiftType === shiftType && d.position === position);
    if(shift) {
      shift.person = toPerson;
    }
    return true;
  }

  changeDate(month: number, year: number) {
    this.currentMonth = month;
    this.currentYear = year;
    const shifts =  this.shiftsService.shiftplan.find(s => s.month === month && s.year === year)?.shifts ?? null;
    if (!shifts) {
      this.shiftsService.createMonth(month, year)
    }
    this.shifts = this.shiftsService.shiftplan.find(s => s.month === month && s.year === year)?.shifts ?? [];
    console.log("shifts", this.shifts)
    this.generateCalendarDays();
  }

  generateCalendarDays(): void {
    const uniqueDates = [...new Set(this.shifts.map(shift => shift.date))];
    this.calendarDays = uniqueDates.map(date => ({
      date,
      shifts: this.shifts.filter(shift => shift.date.getTime() === date.getTime())
    }));

  }

}
