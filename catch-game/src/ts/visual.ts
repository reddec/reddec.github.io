interface Visual {
    draw(screenW, screenH: number, ctx: CanvasRenderingContext2D, step: number);
}

class Circle implements Visual {
    constructor(readonly item: WithLocation, readonly r: number = 10, readonly color: string = "#ff0000", readonly fill: string = null) {
    }


    draw(screenW, screenH: number, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.fill;
        ctx.beginPath();
        ctx.arc(this.item.at.x, this.item.at.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        if (this.fill) {
            ctx.fill();
        }
    }
}

class GradientCircle implements Visual {
    constructor(readonly item: WithLocation,
                readonly r: number = 10,
                readonly colorBegin: string = "#ff0000",
                readonly colorEnd: string = "#ffffff") {
    }


    draw(screenW, screenH: number, ctx: CanvasRenderingContext2D) {
        let grad = ctx.createRadialGradient(this.item.at.x, this.item.at.y,
            this.r,
            this.item.at.x, this.item.at.y, 0);
        grad.addColorStop(0, this.colorEnd);
        grad.addColorStop(1, this.colorBegin);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.fillRect(this.item.at.x - this.r, this.item.at.y - this.r, this.r * 2, this.r * 2);
    }
}


class DynamicLabel implements Visual {
    constructor(public at: Point,
                public content: () => string,
                public color: string = '#000000',
                public font: string = '20px Monospace') {
    }


    draw(screenW, screenH: number, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.beginPath();
        ctx.fillText(this.content(), this.at.x, this.at.y);

    }
}

class Grid implements Visual {
    draw(screenW, screenH: number, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = this.stroke;
        for (let x = 0; x < screenW; x += this.step) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, screenH);
        }

        for (let y = 0; y < screenH; y += this.step) {
            ctx.moveTo(0, y);
            ctx.lineTo(screenW, y);
        }
        ctx.stroke();

    }

    constructor(readonly step: number = 20, readonly stroke: string = "dotted #cccccc") {
    }

}


interface WithPath {
    path: Array<Point>
}

class Path implements Visual {
    constructor(readonly obj: WithPath, readonly size: number = 3, readonly stroke: string = '#000000') {
    }

    draw(screenW, screenH: number, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = this.stroke;
        let path = this.obj.path;
        if (path.length == 0) return;
        ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; ++i) {
            let pt = path[i];
            if (pt.x < 0 || pt.x > screenW || pt.y < 0 || pt.y > screenH)
                continue;
            ctx.lineTo(pt.x, pt.y);
        }

        ctx.stroke();

    }
}

interface PowerProvider {
    readonly lastForce: Point
    readonly maxPower: number
}


class Rocket implements Visual {
    constructor(readonly obj: PhysicalItem,
                readonly engine: PowerProvider,
                readonly size: number = 10, readonly stroke: string = '#ff0000') {

    }

    draw(screenW, screenH: number, ctx: CanvasRenderingContext2D, step: number) {
        let center = this.obj.at;
        ctx.strokeStyle = this.stroke;
        ctx.fillStyle = this.stroke;
        ctx.beginPath();
        ctx.arc(center.x, center.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
        let power = this.engine.lastForce.length();
        if (power > 0) {
            let angle = this.engine.lastForce.angle();
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
            } else {
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
    }
}
