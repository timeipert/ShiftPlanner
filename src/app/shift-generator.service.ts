import {Injectable} from '@angular/core';
import {PersonsService} from "./persons.service";
import {DatingService} from "./dating.service";
import {ShiftsService} from "./shifts.service";
import {Availability, Position, ShiftType, AvailabilityType, AssignmentsType} from "./models";
import {AvailabilityService} from "./availability.service";


@Injectable({
  providedIn: 'root'
})
export class ShiftGeneratorService {


  constructor(public personsService: PersonsService, public datingService: DatingService, public shiftsSerivce: ShiftsService) {

  }

  getData() {
    const employees = this.personsService.personList
    const shifts = this.datingService.shifts;
    const shiftIds = shifts.map(shift => shift.id)
    const employeesIds = employees.map(d => d.id)

    const availability: AvailabilityType = {};
    employees.forEach(employee => {
      const availableShifts = shifts.filter(shift => employee.shiftPreferences.find(d => {
        if (d.date.getTime()
          !== shift.date.getTime()) {
          return false;
        }
        if ((employee.preferredPosition !== Position.Both) && (shift.position !== employee.preferredPosition)) {
          return false;
        }
        if (shift.shiftType === ShiftType.Morning && d.morning === Availability.Yes) {
          return true;
        } else if (shift.shiftType === ShiftType.Afternoon && d.afternoon === Availability.Yes) {
          return true;
        } else if ((shift.shiftType === ShiftType.Evening || shift.shiftType === ShiftType.Evening2) && d.evening === Availability.Yes) {
          return true;
        } else {
          return false;
        }
      })).map(d => d.id);
      availability[employee.id] = availableShifts;
    })
    console.log(shiftIds, employees, availability);
    return {shifts, employeesIds, employees, availability}
  }

  assignSchedule(assignments: any) {
    Object.keys(assignments).forEach((shiftId: any) => {
      const shift = this.datingService.shifts.find(d => d.id == parseInt(shiftId))
      if (!shift) {
        console.warn("NO SHIFT FOUND");
        return 0;
      }
      const person = this.personsService.personList.find(d => d.id == parseInt(assignments[shiftId]))
      if (!person) {
        console.warn("NO Person FOUND");
        return 0;
      }
      shift.assignPerson(person);
      return 0;
    })
  }


  optimizeShiftSchedule(shifts: any, employees: any, employeeObs: any, availability: AvailabilityType) {
    let assignments: AssignmentsType = {};

    for (let i = 0; i < shifts.length; i++) {
      console.log("new Shift");
      let shift = shifts[i];
      let shiftsToday = shifts.filter((s: any) => s.date.getTime() === shift.date.getTime());

      // Find the employees who are available for this shift and didn't work today
      let candidates = employees.filter((emp: any) => {
        if (!availability[emp]) return false;
        let hasShiftToday = shiftsToday.some((s: any) => assignments[s.id] === emp);
        return (
          availability[emp].includes(shift.id) &&
          !hasShiftToday &&
          (!assignments[shift.id])
        );
      });

      // If no one is available or everyone has reached their maximum shifts, skip this shift
      if (candidates.length === 0) {
        //console.log(`No one is available for ${shift}`);
        continue;
      }
      console.log("there would be someone available");

      // Otherwise, assign the shift to the candidate who has worked the least so far and has least future availability
      let minShifts = Infinity;
      let minAvailability = Infinity;
      let bestCandidate;
      for (let candidate of candidates) {

        let numShifts = Object.values(assignments).filter(e => e === candidate).length;
        let futureAvailability = availability[candidate].filter(shift => shifts.indexOf(shift) > i).length;

        // Prefer employees who have worked less and have less future availability

        console.log(candidate, employeeObs[candidate-1]?.maximumShifts, numShifts)
        if (
          (numShifts < employeeObs[candidate-1]?.maximumShifts) &&
          ((numShifts < minShifts) || (numShifts === minShifts && futureAvailability < minAvailability))
        ) {
          minShifts = numShifts;
          minAvailability = futureAvailability;
          bestCandidate = candidate;
        }
      }

      // Assign the shift to the best candidate
      console.log("bestC", bestCandidate);
      assignments[shift.id] = bestCandidate;
    }
    return assignments;
  }

}
