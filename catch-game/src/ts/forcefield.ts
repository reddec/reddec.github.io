interface ForceField extends WithLocation {

    AmplAt(at: Point): number
}


class StaticRadioEmission implements ForceField, Stepper {

    constructor(readonly power: number, public at: Point = new Point()) {
    }

    AmplAt(at: Point): number {
        let r = this.at.distanceTo(at);
        if (r < 1) return this.power;
        return this.power / (r * r);
    }

    StepUpdated() {
    }
}

class LinearEmission implements ForceField, Stepper {
    constructor(readonly power: number, readonly koef: number = 1, public at: Point = new Point()) {
    }


    AmplAt(at: Point): number {
        let r = this.at.distanceTo(at);
        if (r < 1) return this.power;
        let v = this.power / (this.koef * r);
        if (v > this.power) return this.power;
        return v;
    }

    StepUpdated() {
    }
}


