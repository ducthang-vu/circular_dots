console.log('main.js is working')

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
    }

    move() {
        this.angle += this.arcAngle
    }

    print() {
        c.beginPath()
        c.strokeStyle = this.color
        c.arc(this.x, this.y, this.radius, this.angle, this.angle + this.arcAngle)
        c.lineWidth = 2
        c.stroke()
    }
}

class Animation {
    constructor(dotsNumber, translateSpeed) {
        self = this
        this.dotsNumber = dotsNumber
        this.translateSpeed = translateSpeed
        this.dots = []
        this.center = [canvas.width / 2, canvas.height / 2]

        window.onresize = resizeCanvas
        for (let i = 0; i < dotsNumber; i++) {
            this.dots.push(new circleDot(canvas.width / 2, canvas.height / 2, Math.random() * 20 + 60, 'blue') )
        }

        /*setInterval(() => {
            console.log(this.center)
        }, 1000);*/
    }

    setCenter() {
        document.addEventListener('mousemove', function(e) {self.center = [e.clientX, e.clientY]})
        document.addEventListener('mouseleave', () => {this.center = [canvas.width / 2, canvas.height / 2]})
    }

    setMousecenter() {
        for (let dot of this.dots) {
            let distanceX = (this.center[0] - dot.x)
            let distanceY = (this.center[1] - dot.y)
            //console.log(distanceY)
            let distance = ((distanceX**2 + distanceY**2)**0.5)
            
            if (distance > 0 && distance < 0.5) {
                dot.x = this.center[0]
                dot.y = this.center[1]
            } else if (distance > 0.5) {
                let ratio = this.translateSpeed / distance
                //console.log(ratio)
                //console.log(distanceX, ratio, distanceX * ratio)
                dot.x += distanceX * ratio
                dot.y += distanceY * ratio
            }

        }
    }

    addCanvasLayer() {
        c.beginPath()
        c.rect(0, 0, canvas.width, canvas.height)
        c.fillStyle = 'rgba(255, 255, 255, 0.1)'
        c.fill()
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.setMousecenter() 
        this.addCanvasLayer()

        for (let dot of this.dots) {
            dot.move()
            dot.print()
        }
    }

    start() {
        this.setCenter()
        this.animate()
    }
}

animation = new Animation(50, 5)
animation.start()