class BasicWorld {

    private targetRadius: number = 20;
    private rocketRadius: number = 10;
    private planetRadius: number = 30;

    private timer: number;

    private planet: StaticRadioEmission;
    private planetBorder: RadialSingleSpot;

    private rocket: MassObject;
    private rocketEngine: SmartEngine;

    private target: RadialSingleSpot;

    private tracer: Tracer;

    get width(): number {
        return this.engine.element.width;
    }

    get height(): number {
        return this.engine.element.height;
    }

    constructor(readonly engine: Engine,
                private logic: (step: number) => Point,
                private onGameWin: (any) => any,
                private onGameLose: (any) => any) {
        this.initEnvironment();
        this.initLinks();
        this.initUI();
    }

    private initEnvironment() {
        let center = new Point(this.width / 2, this.height / 2);

        this.planet = new StaticRadioEmission(10000, center);
        this.rocket = new MassObject(20, center.right(100).bottom(100));
        this.rocketEngine = new SmartEngine(this.rocket, this.logic);
        this.target = new RadialSingleSpot(center.left(120).top(70), this.onGameWin, this.targetRadius + this.rocketRadius, [this.rocket]);
        this.planetBorder = new RadialSingleSpot(this.planet.at, this.onGameLose, this.planetRadius + this.rocketRadius, [this.rocket]);
        this.tracer = new Tracer(this.rocket);

        this.engine.items.push(this.planet, this.rocket, this.target, this.planetBorder, this.tracer, this.rocketEngine);
    }

    private initLinks() {
        this.engine.items.push(new ForceLink([this.rocket], [this.planet]));
    }

    private initUI() {
        this.engine.visuals.push(
            new Grid(50, '#eeeeee'),
            new Path(this.tracer),
            new Circle(this.planet, this.planetRadius, '#00ff00'),
            new Circle(this.target, this.targetRadius, '#0000ff', '#0000ff'),
            new Rocket(this.rocket, this.rocketEngine, this.rocketRadius),
            new DynamicLabel(new Point(20, 20), () => {
                return 'Step: ' + this.engine.currentStep;
            }),
            new DynamicLabel(new Point(20, 45), () => {
                return 'Fuel: ' + this.rocketEngine.usage.toFixed(3);
            })
        );
    }

    start() {
        this.stop();
        this.timer = setInterval(() => {
            this.engine.update();
        }, 41);
    }

    stop() {
        clearInterval(this.timer);
    }

    update() {
        this.engine.update();
    }


}