const setting = require('../../pair-setting.json');
const exmo = require('../config/connect');
const {
    apiKey,
    apiSecret,
    currentPair,
    currency1MinQuantity,
    orderLifeTime,
    stockFee,
    avgPricePeriod,
    canSpend,
    profit,
    stockTimeOffset,
} = require('../config/env');

exmo.init_exmo({ key: apiKey, secret: apiSecret });

function trade(currency1, currency2) {
    exmo.api_query('user_open_orders', {}, result => {
        let res = JSON.parse(result);
        if (res[currentPair] === undefined) console.log('no active orders');

        let buyOrders = [];

        for (let i in res[currentPair]) {
            console.log(res[currentPair][i]);
            if (res[currentPair][i].type == 'sell') {
                console.log('pending... there are active sell orders');
            } else {
                buyOrders.push(res[currentPair][i]);
            }
        }

        if (buyOrders.length > 0) {
            for (let key in buyOrders) {
                console.log(
                    `checkin pending orders 
                    ${buyOrders[key]['order_id']}`,
                );

                exmo.api_query(
                    'order_trades',
                    { order_id: buyOrders[key]['order_id'] },
                    result => {
                        let res = JSON.parse(result);

                        if (res.result !== false) {
                            console.log(
                                'expect it is still possible to buy currency at the same rate',
                            );
                        } else {
                            let timePassed =
                                new Date().getTime() / 1000 +
                                stockTimeOffset * 60 * 60 -
                                buyOrders[key]['created'];

                            if (timePassed > orderLifeTime * 60) {
                                exmo.api_query(
                                    'order_cancel',
                                    { order_id: buyOrders[key]['order_id'] },
                                    res => {
                                        let result = JSON.parse(res);
                                        if (result.error)
                                            console.log(result.error);

                                        console.log(
                                            `cancel the order in ${orderLifeTime} minutes failed to buy ${currency1}`,
                                        );
                                    },
                                );
                            } else {
                                console.log(
                                    `expect it is still possible to buy currency at the same rate, order exists ${timePassed} seconds`,
                                );
                            }
                        }
                    },
                );
            }
        } else {
            exmo.api_query('user_info', {}, result => {
                let res = JSON.parse(result);

                let balance = res.balances[currency1];
                let balance2 = res.balances[currency2];

                if (balance >= currency1MinQuantity) {
                    let wannaGet = canSpend + canSpend * (stockFee + profit);
                    console.log('sell', balance, wannaGet, wannaGet / balance);

                    let options = {
                        pair: currentPair,
                        quantity: balance,
                        price: wannaGet / balance,
                        type: 'sell',
                    };
                    exmo.api_query('order_create', options, res => {
                        let result = JSON.parse(res);
                        if (result.error) console.log(result.error);

                        console.log(
                            'sales order created',
                            currency1,
                            result.order_id,
                        );
                    });
                } else {
                    if (parseInt(balance2) >= parseInt(canSpend)) {
                        exmo.api_query(
                            'trades',
                            { pair: currentPair },
                            result => {
                                let res = JSON.parse(result);
                                let prices = [];
                                let summ2 = 0;
                                for (deal in res[currentPair]) {
                                    let timePassed = 0;

                                    timePassed =
                                        new Date().getTime() / 1000 +
                                        stockTimeOffset * 60 * 60 -
                                        res[currentPair][deal].date;

                                    if (timePassed < avgPricePeriod * 60) {
                                        summ2 += parseInt(
                                            res[currentPair][deal].price,
                                        );
                                        prices.push(
                                            parseInt(
                                                res[currentPair][deal].price,
                                            ),
                                        );
                                    }
                                }

                                let avgPrice = summ2 / prices.length;

                                let needPrice =
                                    avgPrice - avgPrice * (stockFee + profit);
                                let ammount = canSpend / needPrice;

                                console.log('buy', ammount, needPrice);

                                if (ammount > currency1MinQuantity) {
                                    let options = {
                                        pair: currentPair,
                                        quantity: ammount,
                                        price: needPrice,
                                        type: 'buy',
                                    };

                                    exmo.api_query(
                                        'order_create',
                                        options,
                                        res => {
                                            let result = JSON.parse(res);
                                            if (result.error)
                                                console.log(result.error);

                                            console.log(
                                                'purchase order created',
                                                result.order_id,
                                            );
                                        },
                                    );
                                } else {
                                    console.log(
                                        'there is not enough money to create an order in the balance!!!',
                                    );
                                }
                            },
                        );
                    } else {
                        console.log(
                            'there is not enough money in the balance!!!',
                        );
                    }
                }
            });
        }
    });
}

module.exports = trade;
