# exmo-trade-bot

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![onix](https://img.shields.io/badge/onix-systems-blue.svg)

## Description

This bot is for trading cryptocurrency assets on the exmo exchange.

### Warning!

Different principles can be used for trading, the trading strategy written in
the source files of the project does not provide a guaranteed income, but only
demonstrates the capabilities of the API.

## Requirements

-   node >= 12
-   npm >= 6

## install

```
'npm install'

```

## Using

To use this bot you need:

-   have an account on the Exmo Exchange (https://exmo.com/en/)
-   generate an api key for the bot to access the account
-   write your keys to the .env file

### Params

#### your trade curency

-   CURRENCY1 - the first currency that the bot will trade
-   CURRENCY2 - the second currency that the bot will trade

#### your trading characteristics

-   ORDER_LIFE_TIME - how many minutes to cancel an outstanding order to buy
    CURRENCY1
-   STOCK_FREE - exchange commission (0.002 = 0.2%)
-   AVG_PRICE_PERIOD - for what period to take the average price (min)
-   CAN_SPEED - how much to spend CURRENCY2 each time you buy CURRENCY1
-   PROFIT - What is the expected price increase (0.001 = 0.1%)
-   STOCK_TIMEOFF_SET - If the exchange time diverges from the current
