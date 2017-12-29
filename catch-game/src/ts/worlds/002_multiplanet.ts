class MultiWorld {
    private timer: number;

    constructor(readonly engine: Engine,
                private logic: (step: number) => Point,
                private onGameWin: (any) => any,
                private onGameLose: (any) => any) {

        const rocketRadius = 10;
        let rocket = new MassObject(20, new Point(202, 444.63755));
        let rocketEngine = new SmartEngine(rocket, logic);
        let rocketUI = new Rocket(rocket, rocketEngine, rocketRadius, '#ff0000');


        const planet0Radius = 30;
        let planet0 = new StaticRadioEmission(22500.0, new Point(749, 387.63755));
        let planet0Border = new RadialSingleSpot(planet0.at, onGameLose, planet0Radius + rocketRadius, [rocket]);
        let planet0UI = new Circle(planet0, planet0Radius, '#008000');


        const planet1Radius = 30;
        let planet1 = new StaticRadioEmission(22500.0, new Point(372, 125.63754999999998));
        let planet1Border = new RadialSingleSpot(planet1.at, onGameLose, planet1Radius + rocketRadius, [rocket]);
        let planet1UI = new Circle(planet1, planet1Radius, '#008000');


        const planet2Radius = 38;
        let planet2 = new StaticRadioEmission(36100.0, new Point(617, 357.63755));
        let planet2Border = new RadialSingleSpot(planet2.at, onGameLose, planet2Radius + rocketRadius, [rocket]);
        let planet2UI = new Circle(planet2, planet2Radius, '#008000');


        const planet3Radius = 30;
        let planet3 = new StaticRadioEmission(22500.0, new Point(440, 206.63754999999998));
        let planet3Border = new RadialSingleSpot(planet3.at, onGameLose, planet3Radius + rocketRadius, [rocket]);
        let planet3UI = new Circle(planet3, planet3Radius, '#008000');


        const planet4Radius = 67;
        let planet4 = new StaticRadioEmission(112225.0, new Point(619, 164.63754999999998));
        let planet4Border = new RadialSingleSpot(planet4.at, onGameLose, planet4Radius + rocketRadius, [rocket]);
        let planet4UI = new Circle(planet4, planet4Radius, '#008000');


        const planet5Radius = 31;
        let planet5 = new StaticRadioEmission(24025.0, new Point(511, 281.63755));
        let planet5Border = new RadialSingleSpot(planet5.at, onGameLose, planet5Radius + rocketRadius, [rocket]);
        let planet5UI = new Circle(planet5, planet5Radius, '#008000');


        const planet6Radius = 30;
        let planet6 = new StaticRadioEmission(22500.0, new Point(351, 29.637549999999976));
        let planet6Border = new RadialSingleSpot(planet6.at, onGameLose, planet6Radius + rocketRadius, [rocket]);
        let planet6UI = new Circle(planet6, planet6Radius, '#008000');


        const planet7Radius = 30;
        let planet7 = new StaticRadioEmission(22500.0, new Point(518, 84.63754999999998));
        let planet7Border = new RadialSingleSpot(planet7.at, onGameLose, planet7Radius + rocketRadius, [rocket]);
        let planet7UI = new Circle(planet7, planet7Radius, '#008000');


        const planet8Radius = 65;
        let planet8 = new StaticRadioEmission(105625.0, new Point(301, 261.63755));
        let planet8Border = new RadialSingleSpot(planet8.at, onGameLose, planet8Radius + rocketRadius, [rocket]);
        let planet8UI = new Circle(planet8, planet8Radius, '#008000');


        const target0Radius = 20;
        let target0 = new RadialSingleSpot(new Point(708, 76.63754999999998), onGameWin, target0Radius + rocketRadius, [rocket]);
        let target0UI = new Circle(target0, target0Radius, '#000080', '#000080');


        const planet9Radius = 30;
        let planet9 = new StaticRadioEmission(22500.0, new Point(745, 209.63754999999998));
        let planet9Border = new RadialSingleSpot(planet9.at, onGameLose, planet9Radius + rocketRadius, [rocket]);
        let planet9UI = new Circle(planet9, planet9Radius, '#008000');


        const planet10Radius = 65;
        let planet10 = new StaticRadioEmission(105625.0, new Point(480, 498.63755));
        let planet10Border = new RadialSingleSpot(planet10.at, onGameLose, planet10Radius + rocketRadius, [rocket]);
        let planet10UI = new Circle(planet10, planet10Radius, '#008000');

        let links = new ForceLink([rocket], [planet0, planet1, planet2, planet3, planet4, planet5, planet6, planet7, planet8, planet9, planet10]);
        let tracer = new Tracer(rocket);
        engine.items.push(
            planet0,
            planet0Border,
            planet1,
            planet1Border,
            planet2,
            planet2Border,
            planet3,
            planet3Border,
            planet4,
            planet4Border,
            planet5,
            planet5Border,
            planet6,
            planet6Border,
            planet7,
            planet7Border,
            planet8,
            planet8Border,
            planet9,
            planet9Border,
            planet10,
            planet10Border,
            target0,
            rocket,
            rocketEngine,
            links,
            tracer
        );
        engine.visuals.push(
            new Grid(50, '#eeeeee'),
            new Path(tracer),
            planet0UI,
            planet1UI,
            planet2UI,
            planet3UI,
            planet4UI,
            planet5UI,
            planet6UI,
            planet7UI,
            planet8UI,
            planet9UI,
            planet10UI,
            target0UI,
            new Rocket(rocket, rocketEngine, rocketRadius),

            new DynamicLabel(new Point(20, 20), () => {
                return 'Step: ' + engine.currentStep;
            }),


            new DynamicLabel(new Point(20, 45), () => {
                return 'Fuel: ' + rocketEngine.usage.toFixed(3);
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