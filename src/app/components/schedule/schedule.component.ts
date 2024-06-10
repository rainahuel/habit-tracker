import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitComponent } from '../habit/habit.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, HabitComponent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  datesOfWeek: Date[] = [];
  hoursOfDay: string[] = Array.from({ length: 24 }, (_, i) => `${i}:00 - ${i + 1}:00`);
  selectedCell: { day: string, hour: string } | null = null;
  habits: { [key: string]: string } = {};
  cellColors: { [key: string]: string } = {};
  showModal: boolean = false;

  @Output() cellClicked = new EventEmitter<{ day: string, hour: string }>();

  ngOnInit() {
    this.calculateWeekDates();
  }

  calculateWeekDates() {
    const current = new Date();
    const first = current.getDate() - current.getDay() + 1;
    this.datesOfWeek = Array.from({ length: 7 }, (_, i) => new Date(current.setDate(first + i)));
  }

  onCellClick(day: string, hour: string) {
    this.selectedCell = { day, hour };
    this.cellClicked.emit(this.selectedCell);
    this.showModal = true;
  }

  onCloseModal() {
    this.showModal = false;
  }

  onHabitAdded(event: { habitName: string, habitDuration: number }) {
    if (this.selectedCell) {
      const key = `${this.selectedCell.day}-${this.selectedCell.hour}`;
      this.habits[key] = `${event.habitName} (${event.habitDuration} min)`;
      this.cellColors[key] = this.getRandomColor();
      this.selectedCell = null;
      this.showModal = false;
    }
  }

  onHabitRemoved() {
    if (this.selectedCell) {
      const key = `${this.selectedCell.day}-${this.selectedCell.hour}`;
      delete this.habits[key];
      delete this.cellColors[key];
      this.selectedCell = null;
      this.showModal = false;
    }
  }

  getTotalTime(day: string): number {
    return Object.keys(this.habits).reduce((total, key) => {
      if (key.startsWith(day)) {
        const match = this.habits[key]?.match(/\d+/);
        if (match) {
          const duration = parseInt(match[0], 10);
          return total + duration;
        }
      }
      return total;
    }, 0);
  }

  getTotalTimeAllDays(): number {
    return Object.keys(this.habits).reduce((total, key) => {
      const match = this.habits[key]?.match(/\d+/);
      if (match) {
        const duration = parseInt(match[0], 10);
        return total + duration;
      }
      return total;
    }, 0);
  }

  formatTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let formattedTime = '';

    if (hours > 0) {
      formattedTime += `${hours} h`;
    }

    if (minutes > 0 || hours === 0) {
      formattedTime += `${hours > 0 ? ', ' : ''}${minutes} min`;
    }
    return formattedTime;
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getCellStyle(day: string, hour: string): any {
    const key = `${day}-${hour}`;
    return { 'background-color': this.cellColors[key] || 'transparent' };
  }

  exportWeek() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Habit Tracker', 14, 22);

    doc.setFontSize(12);
    doc.text(`Total time in habits: ${this.formatTime(this.getTotalTimeAllDays())}`, 14, 32);
    doc.text(`Week of ${this.datesOfWeek[0].getDate()} - ${this.datesOfWeek[6].getDate()}`, 14, 42);

    const head = [[
      '', 
      ...this.daysOfWeek.map((day, index) => `${day} (${this.datesOfWeek[index].getDate()})`)
    ]];
    const body = this.hoursOfDay.map(hour => [
      hour, 
      ...this.daysOfWeek.map(day => this.habits[`${day}-${hour}`] || '')
    ]);

    const totalRow = ['Total Time', ...this.daysOfWeek.map(day => this.formatTime(this.getTotalTime(day)))];
    body.push(totalRow);

    autoTable(doc, {
      head,
      body,
      startY: 52,
      theme: 'grid',
      styles: {
        cellPadding: 2,
        fontSize: 8,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        halign: 'center',
      },
      bodyStyles: {
        valign: 'middle',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: 'auto' },
      },
      showHead: 'firstPage'
    });

    doc.save('Habit_Tracker_Week.pdf');
  }
}
