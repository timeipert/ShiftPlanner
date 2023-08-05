export enum ShiftType {
  Morning = "Morning",
  Afternoon = "Afternoon",
  Evening = "Evening",
  Evening2 = "Evening2",
}

export enum Position {
  Both = "Both",
  Kitchen = "Kitchen",
  Counter = "Counter"
}

export class Person {
  id: number;
  name: string;
  preferredPosition: Position;
  shiftPreferences: ShiftAssignment[];
  maximumShifts: number;

  constructor(id: number, name: string, preferredPosition: Position, maximumShifts: number) {
    this.id = id;
    this.name = name;
    this.preferredPosition = preferredPosition;
    this.shiftPreferences = []
    this.maximumShifts = maximumShifts;
  }

  addShiftPreference(shift: ShiftAssignment): void {
    this.shiftPreferences.push(shift);
  }

  removeShiftPreference(shift: ShiftAssignment): void {
    const index = this.shiftPreferences.findIndex(s => s.date === shift.date);
    if (index !== -1) {
      this.shiftPreferences.splice(index, 1);
    }
  }
}

export enum Availability {
  No,
  Maybe,
  Yes
}


export class ShiftAssignment {
  id: number | null = null;
  date: Date;
  morning: Availability;
  afternoon: Availability;
  evening: Availability;

  constructor( date: Date, morning: Availability, afternoon: Availability, evening: Availability) {

    this.date = date;
    this.morning = morning;
    this.afternoon = afternoon;
    this.evening = evening;
  }

  isAvailable(shiftType: ShiftType) {
    if (shiftType === ShiftType.Morning) {
      return this.morning;
    } else if (shiftType === ShiftType.Afternoon) {
      return this.afternoon;
    } else {
      return this.evening;
    }
  }
}

export class Shift {
  id: number;
  date: Date;
  shiftType: ShiftType;
  position: Position;
  person: any = null;

  constructor(id: number, date: Date, shiftType: ShiftType, position: Position) {
    this.id = id;
    this.date = date;
    this.shiftType = shiftType;
    this.position = position;
    this.person = undefined;
  }

  assignPerson(person: Person | null) {
    this.person = person;
  }
}

export function buildShiftsForMonth(year: number, month: number): Shift[] {
  const shifts: Shift[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);

    // Morning shift - Küche
    const morningShiftKuche = new Shift(day * 100 + 2, date, ShiftType.Morning, Position.Kitchen);
    shifts.push(morningShiftKuche);

    // Afternoon shift - Küche
    const afternoonShiftKuche = new Shift(day * 100 + 4, date, ShiftType.Afternoon, Position.Kitchen);
    shifts.push(afternoonShiftKuche);
    // Night shift - Küche
    const nightShiftKuche1 = new Shift(day * 100 + 7, date, ShiftType.Evening, Position.Kitchen);
    shifts.push(nightShiftKuche1);

    // Morning shift - Tresen
    const morningShiftTresen = new Shift(day * 100 + 1, date, ShiftType.Morning, Position.Counter);
    shifts.push(morningShiftTresen);

    // Afternoon shift - Tresen
    const afternoonShiftTresen = new Shift(day * 100 + 3, date, ShiftType.Afternoon, Position.Counter);
    shifts.push(afternoonShiftTresen);

    // Night shift - Tresen
    const nightShiftTresen1 = new Shift(day * 100 + 5, date, ShiftType.Evening, Position.Counter);
    const nightShiftTresen2 = new Shift(day * 100 + 6, date, ShiftType.Evening2, Position.Counter);
    shifts.push(nightShiftTresen1, nightShiftTresen2);


  }

  return shifts;
}

export interface Month {
  month: number;
  year: number;
  shifts: Shift[];
}

export type AvailabilityType = {
  [key: number]: number[];
};

export type AssignmentsType = {
  [key: number]: number | undefined;
};
