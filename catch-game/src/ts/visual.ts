interface Visual {
    draw(screenW, screenH: number, ctx: CanvasRenderingContext2D);
}

class Circle implements Visual {
    constructor(readonly item: WithLocation, readonly r: number = 10, readonly color: string = "#ff0000") {
    }


    draw(screenW, screenH: number, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.item.at.x, this.item.at.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
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