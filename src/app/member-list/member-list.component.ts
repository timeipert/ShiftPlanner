import {Component, OnInit} from '@angular/core';
import {Person, Position, Shift} from "../models";
import {PersonsService} from "../persons.service";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  positionValues = [Position.Kitchen, Position.Counter, Position.Both]
  personList: Person[] = [];
  selectedPerson: Person | null = null;
  isNewPerson: boolean = false;

  constructor(private personsService: PersonsService) {
  }

  ngOnInit(): void {
    this.personsService.getPersons();
    this.personsService.personList$.subscribe(data => this.personList = data);
  }

  onSelectPerson(person: Person): void {
    this.selectedPerson = person;
    this.isNewPerson = false;
  }

  onAddNewPerson(): void {
    this.selectedPerson = new Person(0, '', Position.Both, 0); // Create a new empty person
    this.isNewPerson = true;
  }

  onSavePerson(): void {
    if (this.selectedPerson) {
      if (this.isNewPerson) {
        this.personsService.addPerson(this.selectedPerson);
        this.personsService.getPersons();
      } else {
        this.personsService.updatePerson(this.selectedPerson);
        this.personsService.getPersons();
      }
      this.selectedPerson = null;
    }
  }

  deletePerson(): void {
    if (this.selectedPerson) {
      const ok = confirm("Do you want to delete the person?")
      if (ok) {
        this.personsService.deletePerson(this.selectedPerson);
        this.selectedPerson = null;
      }
    }
  }


}
