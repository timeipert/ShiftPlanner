import {Injectable} from '@angular/core';
import {Availability, Person, ShiftAssignment, ShiftType} from "./models";
import {PersonsService} from "./persons.service";
import {HttpClient} from "@angular/common/http";
import {DatabaseService} from "./database.service";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  constructor(public personService: PersonsService, private http: HttpClient, private api: DatabaseService) {
  }

  getShiftPreferences(personID: number) {
    return this.http.get(this.api.apiURL + "api.php?action=shift_assignments&id="+personID);
  }

  setAvailability(person: Person, date: Date, shiftType: ShiftType, availability: Availability) {
    const shiftPrefs = this.personService.getPersonById(person.id)?.shiftPreferences

    if (shiftPrefs) {
      let shiftPref = shiftPrefs.find(d => d.date.getTime() === date.getTime())
      if (!shiftPref) {
        shiftPref = new ShiftAssignment( date, Availability.No, Availability.No, Availability.No)
        shiftPrefs.push(shiftPref)
      }
      if (shiftType === ShiftType.Morning) {
        shiftPref.morning = availability;
      } else if (shiftType === ShiftType.Afternoon) {
        shiftPref.afternoon = availability;
      } else {
        shiftPref.evening = availability;
      }
      this.addAvailability(person, shiftPref);
    } else {
      console.warn("No ShiftPref Array found", this.personService.getPersonById(person.id))
    }
    console.log(shiftPrefs)
  }

  addAvailability(person: Person, shiftPref: ShiftAssignment): void {
    const url = `${this.api.apiURL}/api.php`;
    this.http.post<any>(url, {action: 'shift_assignments', personID: person.id, ...shiftPref}).subscribe((result) => {
      console.log("Result", result);
    })

  }


  updatePerson(shiftPref: ShiftAssignment): void {
    const url = `${this.api.apiURL}/api.php`;
    this.http.put<any>(url, {action: 'person', ...shiftPref}).subscribe((success) => {
      console.log(success);
    })
  }

  deletePerson(shiftPref: ShiftAssignment): void {
    const url = `${this.api.apiURL}/api.php?action=shift_assignments&id=${shiftPref.id}`;
    this.http.delete<any>(url).subscribe((success) => {
      console.log(success);
      //this.getPersons();
    })
  }
}
