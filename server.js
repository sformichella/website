export function simulateConfig ({ masses, stepTime }) {
  const simulateNext = simulateNMasses({ masses, stepTime })
  return function (n, init) {
    return [...Array(n)].reduce((data, _) => {
      return [...data, simulateNext(data.slice(-1)[0])]
    }, init)
  }
}

const gravity = 5

function distanceSquared([one, two]) {
  return one.reduce((distance, coord, i) => {
    return distance + (coord - two[i])**2
  }, 0)
}

function simulateNMasses({ masses, stepTime }) {
  return function ([position, velocity]) {
    return masses.reduce((out, primary, pIndex) => {
      const newForces = masses.slice(pIndex + 1).reduce((forces, secondary, s) => {
        const sIndex = (s + 1) + pIndex

        const distanceS = distanceSquared([position[pIndex], position[sIndex]])

        const force = - gravity * primary.mass * secondary.mass / distanceS

        const xDiff = position[pIndex][0] - position[sIndex][0]
        const xForce = force * (xDiff / Math.sqrt(distanceS))

        const yDiff = position[pIndex][1] - position[sIndex][1]
        const yForce = force * (yDiff / Math.sqrt(distanceS))

        return {
          ...forces,
          [`${pIndex}${sIndex}x`]: xForce,
          [`${sIndex}${pIndex}x`]: -xForce,
          [`${pIndex}${sIndex}y`]: yForce,
          [`${sIndex}${pIndex}y`]: -yForce
        }
      }, {})

      const forces = {
        ...out.cache,
        ...newForces
      }

      const xForce = [...Array(masses.length)].reduce((sum, _, index) => {
        return sum + (forces[`${pIndex}${index}x`] || 0)
      }, 0)

      const yForce = [...Array(masses.length)].reduce((sum, _, index) => {
        return sum + (forces[`${pIndex}${index}y`] || 0)
      }, 0)

      const xAccel = xForce / primary.mass
      const yAccel = yForce / primary.mass

      const xVel = velocity[pIndex][0] + xAccel * (stepTime / 1000)
      const yVel = velocity[pIndex][1] + yAccel * (stepTime / 1000)

      const x = position[pIndex][0] + (stepTime / 1000) * (velocity[pIndex][0] + xVel) / 2
      const y = position[pIndex][1] + (stepTime / 1000) * (velocity[pIndex][1] + yVel) / 2

      return {
        data: [
          [...out.data[0], [x,y]],
          [...out.data[1], [xVel, yVel]]
        ],
        cache: { ...out.cache, ...forces }
      }
    }, { data: [[], []], cache: {} }).data
  }
}


// function simulateMasses({ masses, stepTime }) {
//   const [mass1, mass2] = masses
//   const massVolume = gravity * (mass1.mass * mass2.mass)

//   return function simulateNext([position, velocity]) {
//     const distanceS = distanceSquared(position)
  
//     const force = massVolume / distanceS
    
//     const xDiff = position[0][0] - position[1][0]
  
//     const xForce = - force * (xDiff / Math.sqrt(distanceS))
  
//     const xAccel1 = xForce / mass1.mass
//     const xAccel2 = -1 * xForce / mass2.mass
  
//     const newXVel1 = velocity[0][0] + xAccel1 * (stepTime / 1000)
//     const newXVel2 = velocity[1][0] + xAccel2 * (stepTime / 1000)
  
//     const x1 = position[0][0] + (stepTime / 1000) * (velocity[0][0] + newXVel1) / 2
//     const x2 = position[1][0] + (stepTime / 1000) * (velocity[1][0] + newXVel2) / 2
  
//     const yDiff = position[0][1] - position[1][1]
  
//     const yForce = - force * (yDiff / Math.sqrt(distanceS))
  
//     const yAccel1 = yForce / mass1.mass
//     const yAccel2 = -1 * yForce / mass2.mass
  
//     const newYVel1 = velocity[0][1] + yAccel1 * (stepTime / 1000)
//     const newYVel2 = velocity[1][1] + yAccel2 * (stepTime / 1000)
  
//     const y1 = position[0][1] + (stepTime / 1000) * (velocity[0][1] + newYVel1) / 2
//     const y2 = position[1][1] + (stepTime / 1000) * (velocity[1][1] + newYVel2) / 2
  
//     return [
//       [[x1, y1], [x2, y2]],
//       [[newXVel1, newYVel1], [newXVel2, newYVel2]]
//     ]
//   }
// }
