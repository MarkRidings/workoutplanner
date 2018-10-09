import * as _ from 'lodash';

export class Interval {

  duration: number;
  intensity: number;

  constructor(duration: number, intensity: number) {
    this.duration = duration;
    this.intensity = intensity;
  }
}

export class Workout {

  intervals: Interval[];
  name: string;

  constructor(name: string) {
    this.intervals = [];
    this.name = name;
  }

  public addInterval(interval: Interval) {
    console.log('adding interval: ', interval);
    this.intervals.push(interval);
  }

  computeIF(): number {
    let timeList: number[] = [];
    this.intervals.forEach((interval) => {
      const aux = new Array(interval.duration).fill(interval.intensity);
      timeList = timeList.concat(aux);
    });

    const rollingAvgs = this.createRollingAvgList(timeList);
    const quadAvg = _
      .chain(rollingAvgs)
      .map(this.quad)
      .mean()
      .value();

    return Math.pow(quadAvg, 0.25);
  }

  computeTss(): number {
    const intensity = this.computeIF();
    const seconds = this.computeSeconds();
    return Math.pow(intensity, 2) * seconds / 36;
  }

  computeSeconds(): number {
    return _.sum(this.intervals.map((interval) => interval.duration));
  }

  private createRollingAvgList(timeList: number[]): number[] {
    const rollingAvgs: number[] = [];
    const start = 29;
    for (let i = start; i < timeList.length; i++) {
      const currentIndex = i - start;
      const rollingAvg = _
        .chain(timeList)
        .slice(currentIndex, currentIndex + 30)
        .mean()
        .value();

      rollingAvgs.push(rollingAvg);
    }

    return rollingAvgs;
  }

  private quad(n: number): number {
    return Math.pow(n, 4);
  }

}
