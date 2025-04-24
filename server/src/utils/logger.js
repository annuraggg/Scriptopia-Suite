"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pino_1 = require("pino");
var pinoLog = (0, pino_1.default)({ level: "info" }, (0, pino_1.transport)({
    targets: [
        {
            target: "@axiomhq/pino",
            options: {
                dataset: process.env.AXIOM_DATASET,
                token: process.env.AXIOM_TOKEN,
            },
        },
        // { target: "pino-pretty", options: { colorize: true } },
    ],
}));
var logger = /** @class */ (function () {
    function logger() {
    }
    logger.prototype.info = function (message) {
        var date = new Date();
        pinoLog.info(message);
        console.log("\u001B[37m[".concat(date.toISOString(), "] \u001B[32mINFO: \u001B[34m").concat(message, " \u001B[37m"));
    };
    logger.prototype.error = function (message) {
        pinoLog.error(message);
        console.error("\u001B[37m[".concat(new Date().toISOString(), "] \u001B[31mERROR: \u001B[31m").concat(message, " \u001B[37m"));
        console.trace();
    };
    logger.prototype.warn = function (message) {
        pinoLog.warn(message);
        console.warn("\u001B[37m[".concat(new Date().toISOString(), "] \u001B[33mWARN: \u001B[33m").concat(message, " \u001B[37m"));
    };
    return logger;
}());
exports.default = new logger();
