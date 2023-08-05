import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shift, Month } from './models'; // Import the models from the provided file


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  apiURL = "http://127.0.0.1:8000/"

  constructor() { }
}
