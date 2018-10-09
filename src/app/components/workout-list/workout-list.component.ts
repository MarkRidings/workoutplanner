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
          console.log('getting... ', workoutName, workoutFileText);
          const workout = this.workoutService.createWorkout(workoutFileText, workoutName);
          this.workouts.push(workout);
        });
      });
    });
  }

  recordChange(e, selectedWorkout: Workout) {
    if (e.checked) {
      this.selectedWorkouts.push(selectedWorkout);
    } else {
      this.selectedWorkouts = _.filter(this.selectedWorkouts, (workout) => workout.name !== selectedWorkout.name);
    }
  }

  getSelectedTss(): number {
    let total = 0;
    for (let i = 0; i < this.selectedWorkouts.length; i++) {
      total += this.selectedWorkouts[i].computeTss();
    }

    return total;
  }
}
