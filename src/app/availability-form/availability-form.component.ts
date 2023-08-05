import {Component} from '@angular/core';
import {Availability, Person, Shift, ShiftAssignment, ShiftType} from "../models";
import {PersonsService} from "../persons.service";
import {DatingService} from "../dating.service";
import {AvailabilityService} from "../availability.service";


@Component({
  selector: 'app-availability-form',
  templateUrl: './availability-form.component.html',
  styleUrls: ['./availability-form.component.css']
})
export class AvailabilityFormComponent {
  month: number
  year: number
  personList: Person[] = []
  shifts: Shift[]
  calendarDays: any;
  ShiftType = ShiftType
  selectedPerson: Person | undefined;
  Availability = Availability
  nextMonth: Date;
  shiftPrefs: ShiftAssignment[] = [];

  constructor(public personService: PersonsService, public datingService: DatingService, public availabilityService: AvailabilityService) {
    this.nextMonth = new Date();
    this.month = this.nextMonth.getMonth() + 2;
    this.year = this.nextMonth.getFullYear();

    personService.getPersons();
    personService.personList$.subscribe((persons) => {
      this.personList = persons;
    })
    datingService.changeDate(this.month, this.year);
    this.shifts = datingService.shifts;
    this.calendarDays = datingService.calendarDays;
  }

  onSelectPerson(personId: string) {
    console.log("personList", this.personList);
    this.selectedPerson = this.personList.find(person => person.id === parseInt(personId));

    console.log("select: ", personId);
    console.log("select person: ", this.selectedPerson);


    this.availabilityService.getShiftPreferences(parseInt(personId)).subscribe((shift_prefs: any) => {
      console.log("SHIFTPREFS", shift_prefs);
      if (shift_prefs.message !== "No data found.") {
        this.shiftPrefs = shift_prefs;
      }
    })

  }


  onSaveAvailability(date: Date, person: Person, shiftType: ShiftType, availability: Availability) {
    this.availabilityService.setAvailability(person, date, shiftType, availability)
  }

  isAvailable(date: Date, person: Person, shiftType: ShiftType) {
    const shiftPrefs = this.shiftPrefs;
    console.log("SHIFT IS AVAILABLE FORM", shiftPrefs);
    if (shiftPrefs) {
      const assignment = shiftPrefs.find((d: any) => d.date.getTime() === date.getTime())

      if (assignment) {
        return assignment.isAvailable(shiftType);
      } else {

        return Availability.No;
      }
    } else {
      console.error("No person found in isAvailable, availability-form.component.ts")
      return Availability.No;
    }

  }

  isAfter14th() {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    return dayOfMonth > 14;
  }
}
