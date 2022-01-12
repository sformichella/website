import { simulateConfig } from './server.js'
import { batch } from './batch.js'

const mass1 = {
  id: 1,
  mass: 1000000
}

const mass2 = {
  id: 2,
  mass: 1
}

const mass3 = {
  id: 3,
  mass: 0.01
}

const mass4 = {
  id: 3,
  mass: 1
}

const initPosition = [
  [250, 250],
  [100, 250],
  [70, 250],
  [150, 250]
]

const initVelocity = [
  [0,0],
  [0, -180],
  [15,-155],
  [0, -200]
]

const stepTime = 5
const memory = 1000

const config = {
  masses: [mass1, mass2, mass3, mass4],
  stepTime,
  memory
}

const simulateNSteps = simulateConfig(config)

const simulateButton = document.getElementById('simulate')
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const drawCircleOnCtx = drawCircle(context)

function render() {
  let clears = []
  return (data, cache) => {
    const positions = data[0]

    clears = positions.map((pos, i) => {
      if(clears[i]) clears[i]()
      return drawCircleOnCtx(pos)
    })
    // draw path --- probably beginPath(), stroke() every tick is a better solution
    // const sliced = cache.slice(-5)[0]
    // if(sliced !== undefined) {
    //   const [[_, [x, y]]] = sliced
    //   context.beginPath();
    //   context.arc(x, y, 1, 0, 2 * Math.PI);
    //   context.fillStyle = 'red'
    //   context.fill();
    //   context.fillStyle = 'black'
    // }
  }
}

let simulation = batch(memory, [[initPosition, initVelocity]])(simulateNSteps, 20, render())

simulateButton.addEventListener('click', () => {
  simulation = simulation.start ?
  simulation.start() :
  simulation.stop()
})

function drawCircle(context) {
  return function ([x, y]) {
    context.beginPath();
    context.arc(x, y, 3, 0, 2 * Math.PI);
    context.fill();
    return () => context.clearRect(x - 4, y - 4, 8, 8)
  }
}
