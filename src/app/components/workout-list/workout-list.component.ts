import { Component, OnInit } from '@angular/core';
import { Workout } from '../../models/workout';
import { WorkoutService } from '../../providers/workout.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.scss']
})
export class WorkoutListComponent implements OnInit {

  workouts: Workout[] = [];
  selectedWorkouts: Workout[] = [];

  constructor(private workoutService: WorkoutService) {
  }

  ngOnInit() {
    this.workoutService.getWorkoutList().subscribe((workoutListFileText) => {
      let workoutNames = workoutListFileText.split('\n');
      workoutNames = _.filter(workoutNames, (line) => line && line !== '');
      workoutNames.forEach((workoutName) => {
        this.workoutService.getWorkout(workoutName).subscribe((workoutFileText) => {
          const workout = this.workoutService.createWorkout(workoutFileText, workoutName);
          this.workouts.push(workout);
        });
      });
    });
  }

  addWorkout(selectedWorkout: Workout) {
    this.selectedWorkouts.push(selectedWorkout);
  }

  removeWorkout(selectedWorkout: Workout) {
    const index = _.findIndex(this.selectedWorkouts, (workout) => workout.name === selectedWorkout.name);
    if (index !== -1) {
      this.selectedWorkouts.splice(index, 1);
    }
  }

  getSelectedTss(): number {
    let total = 0;
    for (let i = 0; i < this.selectedWorkouts.length; i++) {
      total += this.selectedWorkouts[i].computeTss();
    }

    return total;
  }

  getWorkoutTime(workout: Workout): string {
    return this.formatTime(workout.computeSeconds());
  }

  computeSelectedDuration(): string {
    const totalSeconds = _.sumBy(this.selectedWorkouts, (workout) => workout.computeSeconds());

    return this.formatTime(totalSeconds);
  }

  formatTime(durationSeconds: number): string {
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds - (hours * 3600)) / 60);
    const seconds = durationSeconds - (hours * 3600) - (minutes * 60);

    const hrString = hours < 10 ? `0${hours}` : `${hours}`;
    const minString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secString = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${hrString}:${minString}:${secString}`;
  }

  computeSelectedLowIntensity(): number {
    const ltSecs = _.sumBy(this.selectedWorkouts, (workout) => workout.computeLowIntesitySeconds());
    const totalSecs = _.sumBy(this.selectedWorkouts, (workout) => workout.computeSeconds());

    return totalSecs !== 0 ? (ltSecs / totalSecs) * 100 : 0;
  }
}
