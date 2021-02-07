const Turn = require('node-turn')

const turn = new Turn({
  // Default TURN listener port for UDP is 3478
  authMech: 'long-term',
  credentials: {
    [process.env.TURN_SERVER_USERNAME]: process.env.TURN_SERVER_PASSWORD,
  },
})

module.exports = turn
