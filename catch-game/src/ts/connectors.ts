class ForceLink implements Stepper {
    StepUpdated() {
        this.objects.forEach((item) => {
            this.emitters.forEach(force => {
                let vec = force.at.sub(item.at).norm();
                let f = this.sign * force.AmplAt(item.at);
                item.applyForce(vec.mul(f));
            })
        })
    }

    constructor(readonly objects: Array<PhysicalItem> = [], readonly emitters: Array<ForceField> = [], readonly sign: number = 1) {

    }
}