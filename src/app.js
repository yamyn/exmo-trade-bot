const tradeAvg = require('./strategy/avg.strategy');

let timerId = setTimeout(function tick() {
    tradeAvg();
    timerId = setTimeout(tick, 5000);
}, 5000);
