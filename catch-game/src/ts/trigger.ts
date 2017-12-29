class RadialSingleSpot implements Stepper, WithLocation {
    private triggered: boolean = false;

    StepUpdated(step: number) {
        if (this.triggered) return;

        let spotted = this.monitor
            .filter((item) => item.at.distanceTo(this.at) <= this.radius);
        if (spotted.length > 0) {
            this.triggered = true;
            this.trigger(spotted);
        }
    }

    constructor(readonly at: Point,
                private trigger: (items: Array<WithLocation>) => any,
                readonly radius: number = 20,
                readonly monitor: Array<WithLocation> = []) {
    }
}

class Tracer implements Stepper, WithPath {
    public path: Array<Point> = [];

    constructor(readonly obj: WithLocation) {
    }


    StepUpdated(step: number) {
        if (this.path.length != 0) {
            let last = this.path[this.path.length - 1];
            if (last.distanceTo(this.obj.at) < 3) {
                return;
            }
        }
        this.path.push(this.obj.at);
    }
}