import {Injectable} from '@angular/core';
import {Availability, Month, Person, Position, Shift, ShiftAssignment, ShiftType} from "./models";
import {Observable, Subject, map, pipe, tap, catchError} from "rxjs";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {DatabaseService} from "./database.service";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  personList$: Subject<Person[]> = new Subject<Person[]>();
  personList: Person[] = [];

  constructor(private http: HttpClient, private api: DatabaseService, private error: ErrorService) {

    this.personList$.subscribe((persons: Person[]) => {
      this.personList = persons;
    })
  }

  getPersons() {
    console.log("GETPERSONS");
    const url = `${this.api.apiURL}/api.php?action=person`;
    const persons$ = this.http.get<any>(url).pipe(map((result: any) => result.message.persons))
      .pipe(map((persons: any) =>
        persons.map((person: any) => ({
          id: parseInt(person.id), name: person.name, preferredPositions: person.preferredPositions,
          shiftPreferences: JSON.parse(person.shiftPreferences), maximumShifts: person.maximumShifts
        }))
      ))

    persons$.subscribe((persons) => {
      this.personList$.next(persons);
    });
  }

  addPerson(person: Person): void {
    const url = `${this.api.apiURL}/api.php`;
    this.http.post<any>(url, {action: 'person', ...person}).subscribe((result) => {
      console.log("Result", result);
    })

    console.log("POST Personn", person)
  }


  updatePerson(person: Person): void {
    const url = `${this.api.apiURL}/api.php`;
    this.http.put<any>(url, {action: 'person', ...person}).subscribe((success) => {
      console.log(success);
    })
  }

  deletePerson(person: Person): void {
    const url = `${this.api.apiURL}/api.php?action=person&id=${person.id}`;
    this.http.delete<any>(url).subscribe((success) => {
      console.log(success);
      this.getPersons();
    })
  }

  getPersonById(id: number): Person | undefined {
    return this.personList.find(p => p.id === id);
  }
}
