interface PhysicalItem extends WithLocation {
    applyForce(force: Point)

}

class MassObject implements Stepper, PhysicalItem {

    constructor(readonly mass: number = 10, public at: Point = new Point(), public speed: Point = new Point()) {
    }

    applyForce(force: Point) {
        this.speed = this.speed.add(force.div(this.mass));
    }

    StepUpdated() {
        this.at = this.at.add(this.speed);
    }
}


class SmartEngine implements Stepper {
    private usedPower: number = 0;

    get usage(): number {
        return this.usedPower;
    }

    StepUpdated(step: number) {
        let force = this.logic(step);
        if (!force) return;
        let power = force.length();
        if (power > this.maxPower) {
            power = this.maxPower;
            force = force.norm().mul(this.maxPower);
        }
        this.usedPower += power;
        this.obj.applyForce(force);
    }

    constructor(readonly obj: PhysicalItem,
                readonly logic: (step: number) => Point,
                readonly maxPower: number = 10) {
    }
}