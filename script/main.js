canvas = document.getElementById('canvas')
c = canvas.getContext('2d')

/* FIX CANVAS */
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

resizeCanvas()


/* MAIN */
class circleDot {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.angle = Math.random() * 2 * Math.PI 
        this.arcAngle = 0.05
        this.arcPoint = {
            x: this.x + this.radius * Math.cos(this.angle),
            y: this.y + this.radius * Math.sin(this.angle)
        }
        this.width = 3
    }

    makePath() {
        let start = {
            x: this.arcPoint.x,
            y:  this.arcPoint.y
        }
        let end = {
            x: this.x + this.radius * Math.cos(this.angle + this.arcAngle),
            y: this.y + this.radius * Math.sin(this.angle + this.arcAngle)
        }

        this.angle += this.arcAngle;
        [this.arcPoint.x, this.arcPoint.y] = [end.x, end.y]        

        return {
            start: start,
            end: end
        }
    }

    print(object) {
        c.beginPath()
        c.strokeStyle = this.color
        c.moveTo(object.start.x, object.start.y)
        c.lineTo(object.end.x, object.end.y)
        c.lineWidth = this.width
        c.stroke()
    }
}


class Animation {
    constructor(dotsNumber, maxTranslateSpeed) {
        self = this
        this.dotsNumber = dotsNumber
        this.translateSpeed = maxTranslateSpeed
        this.dots = []
        this.center = {
            x: canvas.width / 2, 
            y: canvas.height / 2
        }

        let ran = []
            for (let j = 40; j <= 62; j++) ran.push(j * 2)
        for (let i = 0; i < dotsNumber; i++) {
            let color = ['#1C3FFF','#FF0AC3','#00FFE3','#FFCC26', '#3DFF0D'][Math.random() * 5 | 0]
            this.dots.push(
                new circleDot(canvas.width / 2, canvas.height / 2, ran[Math.random()*ran.length | 0], color)
            )
        }
    }

    setCenter() {
        document.addEventListener('mousemove', function(e) {
            [self.center.x, self.center.y] = [e.clientX, e.clientY]
        })
        document.addEventListener('mouseleave', () => {
            [this.center.x, this.center.y] = [canvas.width / 2, canvas.height / 2]
        })
    }

    attractToCenter() {
        for (let dot of this.dots) {
            let distanceX = (this.center.x - dot.x)
            let distanceY = (this.center.y - dot.y)
            let distance = ((distanceX**2 + distanceY**2)**0.5)
            
            let step = Math.min(this.translateSpeed, distance / 30)

            if (distance) {
                let ratio = step / distance
                let movX = distanceX * ratio
                let movY = distanceY * ratio

                if (Math.abs(movX) > Math.abs(distanceX)) dot.x = this.center.x
                else dot.x += distanceX * ratio

                if (Math.abs(movY) > Math.abs(distanceY)) dot.y = this.center.y
                else dot.y += distanceY * ratio
            }
        }
    }

    addCanvasLayer() {
        c.beginPath()
        c.rect(0, 0, canvas.width, canvas.height)
        c.fillStyle = 'rgba(0, 0, 0, 0.015)'
        c.fill()
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))

        this.addCanvasLayer()
        this.attractToCenter()
        for (let dot of this.dots) {
            dot.print(dot.makePath())
        }
    }

    start() {
        window.onresize = resizeCanvas
        this.setCenter()
        this.animate()
    }
}

let animation = new Animation(50, 5)
animation.start()