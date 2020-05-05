require('dotenv').config();
const setting = require('../../../pair-setting.json');

const currency1 = process.env.CURRENCY1 || 'BTC';
const currency2 = process.env.CURRENCY2 || 'USD';

const config = {
    apiKey: process.env.API_KEY || 'api_key',
    apiSecret: process.env.API_SECRET || 'api_secret',
    exchangeUrl: process.env.EXCHANGE_URL || 'https://api.exmo.me/v1/',
    currency1,
    currency2,
    currentPair: `${currency1}_${currency2}`,
    currency1MinQuantity: setting[`${currency1}_${currency2}`].min_quantity,
    orderLifeTime: process.env.ORDER_LIFE_TIME || 3,
    stockFee: process.env.STOCK_FREE || 0.002,
    avgPricePeriod: process.env.AVG_PRICE_PERIOD || 20,
    canSpend: process.env.CAN_SPEED || 5,
    profit: process.env.PROFIT || 0.003,
    stockTimeOffset: process.env.STOCK_TIMEOFF_SET || 0,
};

module.exports = config;
