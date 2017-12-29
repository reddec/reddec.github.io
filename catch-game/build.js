var ForceLink = /** @class */ (function () {
    function ForceLink(objects, emitters, sign) {
        if (objects === void 0) { objects = []; }
        if (emitters === void 0) { emitters = []; }
        if (sign === void 0) { sign = 1; }
        this.objects = objects;
        this.emitters = emitters;
        this.sign = sign;
    }
    ForceLink.prototype.StepUpdated = function () {
        var _this = this;
        this.objects.forEach(function (item) {
            _this.emitters.forEach(function (force) {
                var vec = force.at.sub(item.at).norm();
                var f = _this.sign * force.AmplAt(item.at);
                item.applyForce(vec.mul(f));
            });
        });
    };
    return ForceLink;
}());
var Engine = /** @class */ (function () {
    function Engine(element, items, visuals) {
        if (items === void 0) { items = []; }
        if (visuals === void 0) { visuals = []; }
        this.element = element;
        this.items = items;
        this.visuals = visuals;
        this.step = 0;
        this.ctx = element.getContext('2d');
    }
    Object.defineProperty(Engine.prototype, "currentStep", {
        get: function () {
            return this.step;
        },
        enumerable: true,
        configurable: true
    });
    Engine.prototype.update = function () {
        var _this = this;
        this.items.forEach(function (item) {
            item.StepUpdated(_this.step);
        });
        var w = this.element.width;
        var h = this.element.height;
        this.ctx.clearRect(0, 0, w, h);
        this.visuals.forEach(function (item) {
            item.draw(w, h, _this.ctx, _this.step);
        });
        this.step += 1;
    };
    return Engine;
}());
var StaticRadioEmission = /** @class */ (function () {
    function StaticRadioEmission(power, at) {
        if (at === void 0) { at = new Point(); }
        this.power = power;
        this.at = at;
    }
    StaticRadioEmission.prototype.AmplAt = function (at) {
        var r = this.at.distanceTo(at);
        if (r < 1)
            return this.power;
        return this.power / (r * r);
    };
    StaticRadioEmission.prototype.StepUpdated = function () {
    };
    return StaticRadioEmission;
}());
var LinearEmission = /** @class */ (function () {
    function LinearEmission(power, koef, at) {
        if (koef === void 0) { koef = 1; }
        if (at === void 0) { at = new Point(); }
        this.power = power;
        this.koef = koef;
        this.at = at;
    }
    LinearEmission.prototype.AmplAt = function (at) {
        var r = this.at.distanceTo(at);
        if (r < 1)
            return this.power;
        var v = this.power / (this.koef * r);
        if (v > this.power)
            return this.power;
        return v;
    };
    LinearEmission.prototype.StepUpdated = function () {
    };
    return LinearEmission;
}());
var MassObject = /** @class */ (function () {
    function MassObject(mass, at, speed) {
        if (mass === void 0) { mass = 10; }
        if (at === void 0) { at = new Point(); }
        if (speed === void 0) { speed = new Point(); }
        this.mass = mass;
        this.at = at;
        this.speed = speed;
    }
    MassObject.prototype.applyForce = function (force) {
        this.speed = this.speed.add(force.div(this.mass));
    };
    MassObject.prototype.StepUpdated = function () {
        this.at = this.at.add(this.speed);
    };
    return MassObject;
}());
var SmartEngine = /** @class */ (function () {
    function SmartEngine(obj, logic, maxPower) {
        if (maxPower === void 0) { maxPower = 10; }
        this.obj = obj;
        this.logic = logic;
        this.maxPower = maxPower;
        this.usedPower = 0;
        this.lastForce_ = new Point();
    }
    Object.defineProperty(SmartEngine.prototype, "lastForce", {
        get: function () {
            return this.lastForce_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SmartEngine.prototype, "usage", {
        get: function () {
            return this.usedPower;
        },
        enumerable: true,
        configurable: true
    });
    SmartEngine.prototype.StepUpdated = function (step) {
        var force = this.logic(step);
        if (!force)
            return;
        var power = force.length();
        if (power > this.maxPower) {
            power = this.maxPower;
            force = force.norm().mul(this.maxPower);
        }
        this.lastForce_ = force;
        this.usedPower += power;
        this.obj.applyForce(force);
    };
    return SmartEngine;
}());
var Point = /** @class */ (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Point.prototype.distanceTo = function (pt) {
        var dx = pt.x - this.x;
        var dy = pt.y - this.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    };
    Point.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Point.prototype.left = function (d) {
        return new Point(this.x - d, this.y);
    };
    Point.prototype.right = function (d) {
        return new Point(this.x + d, this.y);
    };
    Point.prototype.top = function (d) {
        return new Point(this.x, this.y - d);
    };
    Point.prototype.bottom = function (d) {
        return new Point(this.x, this.y + d);
    };
    Point.prototype.add = function (pt) {
        return new Point(this.x + pt.x, this.y + pt.y);
    };
    Point.prototype.sub = function (pt) {
        return new Point(this.x - pt.x, this.y - pt.y);
    };
    Point.prototype.div = function (val) {
        return new Point(this.x / val, this.y / val);
    };
    Point.prototype.mul = function (val) {
        return new Point(this.x * val, this.y * val);
    };
    Point.prototype.norm = function () {
        return this.div(this.length());
    };
    Point.prototype.angle = function () {
        var angle = Math.atan(this.y / this.x);
        if (this.x < 0)
            angle = angle + Math.PI;
        return angle;
    };
    return Point;
}());
var RadialSingleSpot = /** @class */ (function () {
    function RadialSingleSpot(at, trigger, radius, monitor) {
        if (radius === void 0) { radius = 20; }
        if (monitor === void 0) { monitor = []; }
        this.at = at;
        this.trigger = trigger;
        this.radius = radius;
        this.monitor = monitor;
        this.triggered = false;
    }
    RadialSingleSpot.prototype.StepUpdated = function (step) {
        var _this = this;
        if (this.triggered)
            return;
        var spotted = this.monitor
            .filter(function (item) { return item.at.distanceTo(_this.at) <= _this.radius; });
        if (spotted.length > 0) {
            this.triggered = true;
            this.trigger(spotted);
        }
    };
    return RadialSingleSpot;
}());
var Tracer = /** @class */ (function () {
    function Tracer(obj) {
        this.obj = obj;
        this.path = [];
    }
    Tracer.prototype.StepUpdated = function (step) {
        if (this.path.length != 0) {
            var last = this.path[this.path.length - 1];
            if (last.distanceTo(this.obj.at) < 3) {
                return;
            }
        }
        this.path.push(this.obj.at);
    };
    return Tracer;
}());
var Circle = /** @class */ (function () {
    function Circle(item, r, color, fill) {
        if (r === void 0) { r = 10; }
        if (color === void 0) { color = "#ff0000"; }
        if (fill === void 0) { fill = null; }
        this.item = item;
        this.r = r;
        this.color = color;
        this.fill = fill;
    }
    Circle.prototype.draw = function (screenW, screenH, ctx) {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.fill;
        ctx.beginPath();
        ctx.arc(this.item.at.x, this.item.at.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        if (this.fill) {
            ctx.fill();
        }
    };
    return Circle;
}());
var GradientCircle = /** @class */ (function () {
    function GradientCircle(item, r, colorBegin, colorEnd) {
        if (r === void 0) { r = 10; }
        if (colorBegin === void 0) { colorBegin = "#ff0000"; }
        if (colorEnd === void 0) { colorEnd = "#ffffff"; }
        this.item = item;
        this.r = r;
        this.colorBegin = colorBegin;
        this.colorEnd = colorEnd;
    }
    GradientCircle.prototype.draw = function (screenW, screenH, ctx) {
        var grad = ctx.createRadialGradient(this.item.at.x, this.item.at.y, this.r, this.item.at.x, this.item.at.y, 0);
        grad.addColorStop(0, this.colorEnd);
        grad.addColorStop(1, this.colorBegin);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.fillRect(this.item.at.x - this.r, this.item.at.y - this.r, this.r * 2, this.r * 2);
    };
    return GradientCircle;
}());
var DynamicLabel = /** @class */ (function () {
    function DynamicLabel(at, content, color, font) {
        if (color === void 0) { color = '#000000'; }
        if (font === void 0) { font = '20px Monospace'; }
        this.at = at;
        this.content = content;
        this.color = color;
        this.font = font;
    }
    DynamicLabel.prototype.draw = function (screenW, screenH, ctx) {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.beginPath();
        ctx.fillText(this.content(), this.at.x, this.at.y);
    };
    return DynamicLabel;
}());
var Grid = /** @class */ (function () {
    function Grid(step, stroke) {
        if (step === void 0) { step = 20; }
        if (stroke === void 0) { stroke = "dotted #cccccc"; }
        this.step = step;
        this.stroke = stroke;
    }
    Grid.prototype.draw = function (screenW, screenH, ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.stroke;
        for (var x = 0; x < screenW; x += this.step) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, screenH);
        }
        for (var y = 0; y < screenH; y += this.step) {
            ctx.moveTo(0, y);
            ctx.lineTo(screenW, y);
        }
        ctx.stroke();
    };
    return Grid;
}());
var Path = /** @class */ (function () {
    function Path(obj, size, stroke) {
        if (size === void 0) { size = 3; }
        if (stroke === void 0) { stroke = '#000000'; }
        this.obj = obj;
        this.size = size;
        this.stroke = stroke;
    }
    Path.prototype.draw = function (screenW, screenH, ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.stroke;
        var path = this.obj.path;
        if (path.length == 0)
            return;
        ctx.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; ++i) {
            var pt = path[i];
            if (pt.x < 0 || pt.x > screenW || pt.y < 0 || pt.y > screenH)
                continue;
            ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
    };
    return Path;
}());
var Rocket = /** @class */ (function () {
    function Rocket(obj, engine, size, stroke) {
        if (size === void 0) { size = 10; }
        if (stroke === void 0) { stroke = '#ff0000'; }
        this.obj = obj;
        this.engine = engine;
        this.size = size;
        this.stroke = stroke;
    }
    Rocket.prototype.draw = function (screenW, screenH, ctx, step) {
        var center = this.obj.at;
        ctx.strokeStyle = this.stroke;
        ctx.fillStyle = this.stroke;
        ctx.beginPath();
        ctx.arc(center.x, center.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
        var power = this.engine.lastForce.length();
        if (power > 0) {
            var angle = this.engine.lastForce.angle();
            //ctx.translate(0, 0);
            ctx.translate(center.x, center.y);
            ctx.rotate(Math.PI + angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            if (step % 4 < 2) {
                ctx.lineTo(this.size * 2, this.size / 2);
                ctx.lineTo(this.size * 1.5, this.size / 4);
                ctx.lineTo(this.size * 2, 0);
                ctx.lineTo(this.size * 1.5, -this.size / 4);
                ctx.lineTo(this.size * 2, -this.size / 2);
            }
            else {
                ctx.lineTo(this.size * 1.5, this.size / 2);
                ctx.lineTo(this.size * 2, this.size / 4);
                ctx.lineTo(this.size * 1.5, 0);
                ctx.lineTo(this.size * 2, -this.size / 4);
                ctx.lineTo(this.size * 1.5, -this.size / 2);
            }
            ctx.lineTo(0, 0);
            ctx.stroke();
            ctx.fill();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    };
    return Rocket;
}());
var BasicWorld = /** @class */ (function () {
    function BasicWorld(engine, logic, onGameWin, onGameLose) {
        this.engine = engine;
        this.logic = logic;
        this.onGameWin = onGameWin;
        this.onGameLose = onGameLose;
        this.targetRadius = 20;
        this.rocketRadius = 10;
        this.planetRadius = 30;
        this.initEnvironment();
        this.initLinks();
        this.initUI();
    }
    Object.defineProperty(BasicWorld.prototype, "width", {
        get: function () {
            return this.engine.element.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicWorld.prototype, "height", {
        get: function () {
            return this.engine.element.height;
        },
        enumerable: true,
        configurable: true
    });
    BasicWorld.prototype.initEnvironment = function () {
        var center = new Point(this.width / 2, this.height / 2);
        this.planet = new StaticRadioEmission(10000, center);
        this.rocket = new MassObject(20, center.right(100).bottom(100));
        this.rocketEngine = new SmartEngine(this.rocket, this.logic);
        this.target = new RadialSingleSpot(center.left(120).top(70), this.onGameWin, this.targetRadius + this.rocketRadius, [this.rocket]);
        this.planetBorder = new RadialSingleSpot(this.planet.at, this.onGameLose, this.planetRadius + this.rocketRadius, [this.rocket]);
        this.tracer = new Tracer(this.rocket);
        this.engine.items.push(this.planet, this.rocket, this.target, this.planetBorder, this.tracer, this.rocketEngine);
    };
    BasicWorld.prototype.initLinks = function () {
        this.engine.items.push(new ForceLink([this.rocket], [this.planet]));
    };
    BasicWorld.prototype.initUI = function () {
        var _this = this;
        this.engine.visuals.push(new Grid(50, '#eeeeee'), new Path(this.tracer), new Circle(this.planet, this.planetRadius, '#00ff00'), new Circle(this.target, this.targetRadius, '#0000ff', '#0000ff'), new Rocket(this.rocket, this.rocketEngine, this.rocketRadius), new DynamicLabel(new Point(20, 20), function () {
            return 'Step: ' + _this.engine.currentStep;
        }), new DynamicLabel(new Point(20, 45), function () {
            return 'Fuel: ' + _this.rocketEngine.usage.toFixed(3);
        }));
    };
    BasicWorld.prototype.start = function () {
        var _this = this;
        this.stop();
        this.timer = setInterval(function () {
            _this.engine.update();
        }, 41);
    };
    BasicWorld.prototype.stop = function () {
        clearInterval(this.timer);
    };
    BasicWorld.prototype.update = function () {
        this.engine.update();
    };
    return BasicWorld;
}());
var MultiWorld = /** @class */ (function () {
    function MultiWorld(engine, logic, onGameWin, onGameLose) {
        this.engine = engine;
        this.logic = logic;
        this.onGameWin = onGameWin;
        this.onGameLose = onGameLose;
        var rocketRadius = 10;
        var rocket = new MassObject(20, new Point(202, 444.63755));
        var rocketEngine = new SmartEngine(rocket, logic);
        var rocketUI = new Rocket(rocket, rocketEngine, rocketRadius, '#ff0000');
        var planet0Radius = 30;
        var planet0 = new StaticRadioEmission(22500.0, new Point(749, 387.63755));
        var planet0Border = new RadialSingleSpot(planet0.at, onGameLose, planet0Radius + rocketRadius, [rocket]);
        var planet0UI = new Circle(planet0, planet0Radius, '#008000');
        var planet1Radius = 30;
        var planet1 = new StaticRadioEmission(22500.0, new Point(372, 125.63754999999998));
        var planet1Border = new RadialSingleSpot(planet1.at, onGameLose, planet1Radius + rocketRadius, [rocket]);
        var planet1UI = new Circle(planet1, planet1Radius, '#008000');
        var planet2Radius = 38;
        var planet2 = new StaticRadioEmission(36100.0, new Point(617, 357.63755));
        var planet2Border = new RadialSingleSpot(planet2.at, onGameLose, planet2Radius + rocketRadius, [rocket]);
        var planet2UI = new Circle(planet2, planet2Radius, '#008000');
        var planet3Radius = 30;
        var planet3 = new StaticRadioEmission(22500.0, new Point(440, 206.63754999999998));
        var planet3Border = new RadialSingleSpot(planet3.at, onGameLose, planet3Radius + rocketRadius, [rocket]);
        var planet3UI = new Circle(planet3, planet3Radius, '#008000');
        var planet4Radius = 67;
        var planet4 = new StaticRadioEmission(112225.0, new Point(619, 164.63754999999998));
        var planet4Border = new RadialSingleSpot(planet4.at, onGameLose, planet4Radius + rocketRadius, [rocket]);
        var planet4UI = new Circle(planet4, planet4Radius, '#008000');
        var planet5Radius = 31;
        var planet5 = new StaticRadioEmission(24025.0, new Point(511, 281.63755));
        var planet5Border = new RadialSingleSpot(planet5.at, onGameLose, planet5Radius + rocketRadius, [rocket]);
        var planet5UI = new Circle(planet5, planet5Radius, '#008000');
        var planet6Radius = 30;
        var planet6 = new StaticRadioEmission(22500.0, new Point(351, 29.637549999999976));
        var planet6Border = new RadialSingleSpot(planet6.at, onGameLose, planet6Radius + rocketRadius, [rocket]);
        var planet6UI = new Circle(planet6, planet6Radius, '#008000');
        var planet7Radius = 30;
        var planet7 = new StaticRadioEmission(22500.0, new Point(518, 84.63754999999998));
        var planet7Border = new RadialSingleSpot(planet7.at, onGameLose, planet7Radius + rocketRadius, [rocket]);
        var planet7UI = new Circle(planet7, planet7Radius, '#008000');
        var planet8Radius = 65;
        var planet8 = new StaticRadioEmission(105625.0, new Point(301, 261.63755));
        var planet8Border = new RadialSingleSpot(planet8.at, onGameLose, planet8Radius + rocketRadius, [rocket]);
        var planet8UI = new Circle(planet8, planet8Radius, '#008000');
        var target0Radius = 20;
        var target0 = new RadialSingleSpot(new Point(708, 76.63754999999998), onGameWin, target0Radius + rocketRadius, [rocket]);
        var target0UI = new Circle(target0, target0Radius, '#000080', '#000080');
        var planet9Radius = 30;
        var planet9 = new StaticRadioEmission(22500.0, new Point(745, 209.63754999999998));
        var planet9Border = new RadialSingleSpot(planet9.at, onGameLose, planet9Radius + rocketRadius, [rocket]);
        var planet9UI = new Circle(planet9, planet9Radius, '#008000');
        var planet10Radius = 65;
        var planet10 = new StaticRadioEmission(105625.0, new Point(480, 498.63755));
        var planet10Border = new RadialSingleSpot(planet10.at, onGameLose, planet10Radius + rocketRadius, [rocket]);
        var planet10UI = new Circle(planet10, planet10Radius, '#008000');
        var links = new ForceLink([rocket], [planet0, planet1, planet2, planet3, planet4, planet5, planet6, planet7, planet8, planet9, planet10]);
        var tracer = new Tracer(rocket);
        engine.items.push(planet0, planet0Border, planet1, planet1Border, planet2, planet2Border, planet3, planet3Border, planet4, planet4Border, planet5, planet5Border, planet6, planet6Border, planet7, planet7Border, planet8, planet8Border, planet9, planet9Border, planet10, planet10Border, target0, rocket, rocketEngine, links, tracer);
        engine.visuals.push(new Grid(50, '#eeeeee'), new Path(tracer), planet0UI, planet1UI, planet2UI, planet3UI, planet4UI, planet5UI, planet6UI, planet7UI, planet8UI, planet9UI, planet10UI, target0UI, new Rocket(rocket, rocketEngine, rocketRadius), new DynamicLabel(new Point(20, 20), function () {
            return 'Step: ' + engine.currentStep;
        }), new DynamicLabel(new Point(20, 45), function () {
            return 'Fuel: ' + rocketEngine.usage.toFixed(3);
        }));
    }
    MultiWorld.prototype.start = function () {
        var _this = this;
        this.stop();
        this.timer = setInterval(function () {
            _this.engine.update();
        }, 41);
    };
    MultiWorld.prototype.stop = function () {
        clearInterval(this.timer);
    };
    MultiWorld.prototype.update = function () {
        this.engine.update();
    };
    return MultiWorld;
}());
//# sourceMappingURL=build.js.map