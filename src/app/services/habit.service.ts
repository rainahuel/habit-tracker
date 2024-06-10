import { Injectable } from '@angular/core';
import { Habit } from '../models/habit.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private habits: Habit[] = [];
  
  constructor() {}

  addHabit(habit: Habit) {
    this.habits.push(habit);
  }

  getTotalDuration(): number {
    return this.habits.reduce((total, habit) => total + habit.duration, 0);
  }

  getHabits(): Habit[] {
    return this.habits;
  }
}
