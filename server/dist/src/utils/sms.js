"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = require("serialport");
const serialPort = new serialport_1.SerialPort({
    path: "/dev/ttyUSB1",
    baudRate: 9600,
    dataBits: 8,
    parity: "none",
    stopBits: 1,
});
serialport_1.SerialPort.list().then(function (ports) {
    ports.forEach(function (port) {
        console.log("Port: ", port);
    });
});
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
serialPort.on("open", () => __awaiter(void 0, void 0, void 0, function* () {
    serialPort.write("AT+CMGF=1\r\n");
    yield delay(2000);
    serialPort.write('AT+CSCS="GSM"\r\n');
    yield delay(2000);
    serialPort.write('AT+CMGS="0743108252"\r\n');
    yield delay(2000);
    serialPort.write("Luni la 16:30, aveti programare la cabinet\r\n");
    yield delay(2000);
    serialPort.write("\x1A");
    yield delay(2000);
}));
