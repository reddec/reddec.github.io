interface Stepper {
    StepUpdated(step: number);

}


class Engine {
    protected ctx: CanvasRenderingContext2D;
    protected step: number = 0;

    get currentStep(): number {
        return this.step;
    }

    constructor(readonly element: HTMLCanvasElement,
                readonly items: Array<Stepper> = [],
                readonly visuals: Array<Visual> = []) {
        this.ctx = element.getContext('2d');
    }


    update() {
        this.items.forEach(item => {
            item.StepUpdated(this.step);
        });

        let w = this.element.width;
        let h = this.element.height;

        this.ctx.clearRect(0, 0, w, h);

        this.visuals.forEach(item => {
            item.draw(w, h, this.ctx, this.step);
        });
        this.step += 1;
    }


}