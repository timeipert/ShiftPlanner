import {Component} from '@angular/core';
import {ShiftsService} from "../shifts.service";
import {Availability, AvailabilityType, Person, Position, Shift, ShiftAssignment, ShiftType} from "../models";
import {PersonsService} from "../persons.service";
import {DatingService} from "../dating.service";
import {ShiftGeneratorService} from "../shift-generator.service";
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-shifttable',
  templateUrl: './shifttable.component.html',
  styleUrls: ['./shifttable.component.css'],
  animations: [
    trigger('slideAndRotate', [
      state('start', style({  transform: 'translate(0,0 ) rotate(0deg)', display: 'none' })),
      state('start2', style({ display: 'block' })),
      state('middle', style({ transform: 'translate(500px, 500px) rotate(180deg)',  })),
      state('end', style({ display: 'none' })),
      transition('start => start2', animate('0.1s')),
      transition('start2 => middle', animate('1s')),
      transition('middle => end', animate('20s')),
    ])
  ]
})
export class ShifttableComponent {

  year;
  month;
  shifts: Shift[] = [];
  persons: Person[];
  animationState: 'start' | 'middle' | 'end' = 'start';


  calendarDays: { date: Date, shifts: Shift[] }[] = [];
  selectedShift: Shift | null = null;
  Position = Position

  closed = false;


  constructor(public shiftsService: ShiftsService,
              public personService: PersonsService,
              public dating: DatingService,
              public shiftGeneratorService: ShiftGeneratorService
  ) {
    const currentDate = new Date();
    this.month = currentDate.getMonth() + 1;
    this.year = currentDate.getFullYear();
    this.persons = personService.personList

    dating.changeDate(this.month, this.year);
    this.calendarDays = dating.calendarDays;
    this.shifts = dating.shifts;

    const shift = this.shifts
      .find(s => s.date.getTime() == new Date(2023, 6, 1).getTime()
        && s.position === Position.Kitchen && s.shiftType === ShiftType.Morning);
    //console.log("SHIFT", this.shifts, shift)
    //shift?.assignPerson(new Person(1, "Tim", Position.Counter));
    //console.log(this.calendarDays)


  }
  assignPerson(person: Person, shift: Shift) {
    if(shift.person == null) {
      shift.assignPerson(person)
    } else {
      shift.assignPerson(null);
    }
    this.selectedShift = null
  }

  toggleClose() {
    this.closed = !this.closed;
    this.dating.toggleClose()
  }

  onCellClick(day: { date: Date, shifts: Shift[] }, shift: Shift): void {
    if(!this.closed) {


      if (this.selectedShift === shift) {
        this.selectedShift = null;
      } else {
        this.selectedShift = shift;
      }
    }

  }

  startHildegard() {

  }

  getPossiblePersons(date: Date, position: Position, shiftType: ShiftType) {
    const persons = this.persons.filter(person => {
      return person.shiftPreferences.find(s => {

        console.log(s.date.getTime() == date.getTime(), date, s.date, s, s.isAvailable(shiftType), shiftType)
        return (person.preferredPosition === Position.Both || person.preferredPosition === position)
          && s.isAvailable(shiftType) === Availability.Yes && s.date.getTime() == date.getTime()
      })

    })
    console.log(persons)
    return persons

  }

  assignShift(person: Person): void {
    if (this.selectedShift) {
      // Update the assigned person for the selected shift
      this.selectedShift.person = person;
    }
  }

  getShiftAssignedPerson(day: { date: Date, shifts: Shift[] }, position: Position, shiftType: ShiftType): Person | null {
    const shift = day.shifts.find(s => s.position === position && s.shiftType === shiftType);
    return shift ? shift.person ? shift.person : null : null;
  }


  previousMonth(): void {
    this.month--;
    if (this.month < 1) {
      this.month = 12;
      this.year--;
    }

    this.dating.changeDate(this.month, this.year);
    this.shifts = this.dating.shifts;
    this.calendarDays = this.dating.calendarDays;

    this.closed = this.dating.closed;
  }

  nextMonth(): void {
    this.month++;
    if (this.month > 12) {
      this.month = 1;
      this.year++;
    }

    this.dating.changeDate(this.month, this.year);
    this.shifts = this.dating.shifts;
    this.calendarDays = this.dating.calendarDays;
    this.closed = this.dating.closed;
  }

  generatePlan() {
    const doit = confirm("Do you really want to change the shiftplan? It overrides everything!")
    if(doit) {
      const data = this.shiftGeneratorService.getData()
      const assignments = this.shiftGeneratorService.optimizeShiftSchedule(data.shifts, data.employeesIds, data.employees, data.availability);
      console.log(assignments);
      this.shiftGeneratorService.assignSchedule(assignments);
    }
  }
  startAnimation() {
    this.animationState = 'middle';
    setTimeout(() => {
      this.animationState = 'end';
    }, 1000); // Change this duration to control the animation timing
  }

  isOvershifted(person: Person) {
    const shiftsForPerson = this.shifts.filter(shift => shift.person === person);
    if(shiftsForPerson.length > person?.maximumShifts) {

      return true;
    } else {
      return false;
    }
  }
}
