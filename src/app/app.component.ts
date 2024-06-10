import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { HabitComponent } from './components/habit/habit.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ScheduleComponent,
    HabitComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedCell: { day: string, hour: string } | null = null;

  onCellClicked(cell: { day: string, hour: string }) {
    this.selectedCell = cell;
  }

  onHabitAdded(event: { habitName: string, habitDuration: number }) {
    if (this.selectedCell) {
      const scheduleComponent = document.querySelector('app-schedule') as any;
      scheduleComponent.addHabit(this.selectedCell.day, this.selectedCell.hour, event.habitName, event.habitDuration);
      this.selectedCell = null;
    } else {
      console.error('selectedCell is null');
    }
  }
}