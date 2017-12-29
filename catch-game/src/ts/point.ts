class Point {
    constructor(readonly x: number = 0, readonly y: number = 0) {
    }

    distanceTo(pt: Point): number {
        let dx = pt.x - this.x;
        let dy = pt.y - this.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    left(d: number): Point {
        return new Point(this.x - d, this.y);
    }

    right(d: number): Point {
        return new Point(this.x + d, this.y);
    }

    top(d: number): Point {
        return new Point(this.x, this.y - d);
    }

    bottom(d: number): Point {
        return new Point(this.x, this.y + d);
    }

    add(pt: Point): Point {
        return new Point(this.x + pt.x, this.y + pt.y);
    }

    sub(pt: Point): Point {
        return new Point(this.x - pt.x, this.y - pt.y);
    }

    div(val: number): Point {
        return new Point(this.x / val, this.y / val);
    }

    mul(val: number): Point {
        return new Point(this.x * val, this.y * val);
    }

    norm(): Point {
        return this.div(this.length());
    }

    angle(): number {
        let angle = Math.atan(this.y / this.x);
        if (this.x < 0) angle = angle + Math.PI;
        return angle;
    }

}

interface WithLocation {
    readonly at: Point
}