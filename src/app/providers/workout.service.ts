import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Interval, Workout } from '../models/workout';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  static parseDuration(timeString: string): number {
    console.log('in parseDuration: ', timeString);
    if (!timeString) {
      throw Error('The timeString passed to parseDuration is not defined');
    }

    const timeParts = timeString.split(':');
    if (timeParts.length !== 3) {
      throw Error(`Invalid format for interval time: ${timeString}`);
    }

    let duration = 0;
    duration += +timeParts[0] * 3600;
    duration += +timeParts[1] * 60;
    duration += +timeParts[2];

    return duration;
  }

  constructor(private http: HttpClient) {
  }

  getWorkoutList() {
    return this.http.get('assets/workouts/workout-list.csv', {responseType: 'text'});
  }

  getWorkout(workoutName: string) {
    return this.http.get(`assets/workouts/${workoutName}.csv`, {responseType: 'text'});
  }

  createWorkout(workoutText: string, workoutName: string): Workout {
    let lines = workoutText.split('\n');
    lines = _.filter(lines, (line) => line && line !== '');

    const workout = new Workout(workoutName);
    const intervals = _.map(lines, this.createInterval);
    intervals.forEach((interval) => {
      workout.addInterval(interval);
    });

    return workout;
  }

  private createInterval(workoutIntervalText: string): Interval {
    const parts = workoutIntervalText.split(',');
    if (!parts || parts.length !== 2) {
      throw Error(`Interval formatted incorrectly in CreateInterval, text: ${workoutIntervalText}`);
    }

    const duration: number = WorkoutService.parseDuration(parts[0]);
    const intensity: number = +parts[1];

    return new Interval(duration, intensity);
  }
}
