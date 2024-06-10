import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-habit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.css']
})
export class HabitComponent {
  @Output() habitAdded = new EventEmitter<{ habitName: string, habitDuration: number }>();

  habitName: string = '';
  habitDuration: number = 10;
  habitList: string[] = [
    'Cardio', 'Meditation', 'Reading', 'Journaling', 'Stretching', 'Walking', 'Running', 
    'Yoga', 'Strength Training', 'Learning a New Skill', 'Cooking at Home', 
    'Spending Time with Family', 'Cleaning', 'Organizing', 'Gardening','Networking', 
    'Volunteering', 'Traveling', 'Listening to Podcasts', 'Practicing a Hobby', 
    'Taking Breaks', 'Time Management', 'Weightlifting'
  ];
  durationList: number[] = Array.from({ length: 6 }, (_, i) => (i + 1) * 10);

  onAddHabit() {
    this.habitAdded.emit({
      habitName: this.habitName,
      habitDuration: this.habitDuration
    });
    this.habitName = '';
    this.habitDuration = 10;
  }
}
