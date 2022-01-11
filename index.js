import { simulateConfig } from './server.js'
import { batch } from './batch.js'

const mass1 = {
  id: 1,
  mass: 10
}

const mass2 = {
  id: 2,
  mass: 100
}

const initPosition = [
  [100, 100],
  [150, 150]
]

const initVelocity = [
  [1.9,-1.9],
  [0,0]
]

const ms = 1000
const memory = 1000

const config = {
  masses: [mass1, mass2],
  ms,
  memory
}

const simulateNSteps = simulateConfig(config)

const simulateButton = document.getElementById('simulate')
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const drawCircleOnCtx = drawCircle(context)

function callback() {
  let clear = [() => {}, () => {}]
  return data => {
    const [one, two] = data[0]

    clear[0]()
    clear[1]()

    const clear1 = drawCircleOnCtx(one)
    const clear2 = drawCircleOnCtx(two)

    clear = [clear1, clear2]
  }
}

let simulation = batch(memory, [[initPosition, initVelocity]])(simulateNSteps, 25, callback())

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
    return () => context.clearRect(x - 5, y - 5, 10, 10)
  }
}
