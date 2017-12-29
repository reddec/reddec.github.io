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
    function Circle(item, r, color) {
        if (r === void 0) { r = 10; }
        if (color === void 0) { color = "#ff0000"; }
        this.item = item;
        this.r = r;
        this.color = color;
    }
    Circle.prototype.draw = function (screenW, screenH, ctx) {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.item.at.x, this.item.at.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
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
//# sourceMappingURL=build.js.map