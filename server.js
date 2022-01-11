export function simulateConfig ({ masses, ms }) {
  const simulateNext = simulateMasses({ masses, ms })
  return function (n, init) {
    return [...Array(n)].reduce((data, _) => {
      return [...data, simulateNext(data.slice(-1)[0])]
    }, init)
  }
}

const gravity = 5

function simulateMasses({ masses, ms }) {
  const [mass1, mass2] = masses
  const massVolume = gravity * (mass1.mass * mass2.mass)

  return function simulateNext([position, velocity]) {
    const distanceS = distanceSquared(position)
  
    const force = massVolume / distanceS
    
    const xDiff = position[0][0] - position[1][0]
  
    const xForce = - force * (xDiff / Math.sqrt(distanceS))
  
    const xAccel1 = xForce / mass1.mass
    const xAccel2 = -1 * xForce / mass2.mass
  
    const newXVel1 = velocity[0][0] + xAccel1 * (ms / 1000)
    const newXVel2 = velocity[1][0] + xAccel2 * (ms / 1000)
  
    const x1 = position[0][0] + (velocity[0][0] + newXVel1) / 2
    const x2 = position[1][0] + (velocity[1][0] + newXVel2) / 2
  
    const yDiff = position[0][1] - position[1][1]
  
    const yForce = - force * (yDiff / Math.sqrt(distanceS))
  
    const yAccel1 = yForce / mass1.mass
    const yAccel2 = -1 * yForce / mass2.mass
  
    const newYVel1 = velocity[0][1] + yAccel1 * (ms / 1000)
    const newYVel2 = velocity[1][1] + yAccel2 * (ms / 1000)
  
    const y1 = position[0][1] + (velocity[0][1] + newYVel1) / 2
    const y2 = position[1][1] + (velocity[1][1] + newYVel2) / 2
  
    return [
      [[x1, y1], [x2, y2]],
      [[newXVel1, newYVel1], [newXVel2, newYVel2]]
    ]
  }
}

function distanceSquared([one, two]) {
  return one.reduce((distance, coord, i) => {
    return distance + (coord - two[i])**2
  }, 0)
}
