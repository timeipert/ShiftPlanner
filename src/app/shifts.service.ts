import { Injectable } from '@angular/core';
import {Person, Shift, buildShiftsForMonth, Month} from './models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DatabaseService} from "./database.service";


@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  shiftplan: Month[];
  constructor(private http: HttpClient, private api: DatabaseService) {
    this.shiftplan = [];
    this.createMonth(8, 2023)

  }
  createMonth(month: number, year: number) {
    this.shiftplan.push({month, year, shifts:buildShiftsForMonth(year, month)})
    console.log(this.shiftplan)
  }

  getShifts(): Observable<Month> {
    const url = `${this.api.apiURL}/api.php?action=shift`;
    return this.http.get<any>(url);
  }

  updateShift(shift: Shift): Observable<any> {
    const url = `${this.api.apiURL}/api.php`;
    return this.http.put(url, {action: "shift", shift});
  }

  insertShift(shift: Shift): Observable<any> {
    const url = `${this.api.apiURL}/api.php`;
    return this.http.post(url, {action: "shift", shift});
  }

  deleteShift(shift: Shift) {
    const url = `${this.api.apiURL}/api.php?id=${shift.id}&action=shift`;
    this.http.delete(url );
  }




}
