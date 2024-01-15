import { SerialPort } from "serialport";

const serialPort = new SerialPort({
  path: "/dev/ttyUSB1",
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
});

SerialPort.list().then(function (ports) {
  ports.forEach(function (port) {
    console.log("Port: ", port);
  });
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

serialPort.on("open", async () => {
  serialPort.write("AT+CMGF=1\r\n");
  await delay(2000);
  serialPort.write('AT+CSCS="GSM"\r\n');
  await delay(2000);
  serialPort.write('AT+CMGS="0743108252"\r\n');
  await delay(2000);
  serialPort.write("Luni la 16:30, aveti programare la cabinet\r\n");
  await delay(2000);
  serialPort.write("\x1A");
  await delay(2000);
});
