import fastifyEnv from "@fastify/env";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyRedis from "@fastify/redis";
import cluster from "node:cluster";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";

import {
  getAdminRoleIdEnv,
  getDatabaseSchemaEnv,
  getDoctorRoleIdEnv,
  getServerIPAddressEnv,
  getServerPortEnv,
  options,
} from "./utils/dotenv.js";
import { drizzleInstance, migrateToDb } from "./utils/drizzle.js";
import { BaseRepository } from "./repositories/base.repository.js";
import { User, userTable } from "./models/user.model.js";
import { roleTable } from "./models/role.model.js";
import { specialityTable } from "./models/speciality.model.js";
import { userRoleMappingTable } from "./models/userRoleMapping.model.js";
import { doctorSpecialityMappingTable } from "./models/doctorSpecialityMapping.model.js";
import fastifyCors from "@fastify/cors";
import { UserRoleMappingRepository } from "./repositories/userRoleMapping.repository.js";
import { userRoutes } from "./routes/user.routes.js";
import { appointmentRoutes } from "./routes/appointment.routes.js";
import { medicalRecordPatientRoutes } from "./routes/medicalRecordPatient.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { authenticationMiddleware } from "./middlewares/auth.middleware.js";
import fastifySocketIO from "fastify-socket.io";

const redisChannel = "socketChannel";
const countChannel = "countChannel";
const CONNECTION_COUNT_CHANNEL = "chat:connection-count-updated";
// const countChannelKey = "chat-connection-count";
export const MESSAGE_CHANNEL = "chat:message-channel";

import { SerialPort } from "serialport";
let serialportgsm = require("serialport-gsm");

// serialportgsm.list((err: any, result: any) => {
//   console.log(result);
// });

const serialPort = new SerialPort({
  path: "/dev/ttyUSB0",
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
});

// serialPort.on("open", () => {
//   serialPort.write("AT+CMGF=1");
//   serialPort.write("\r");
//   serialPort.write("AT+CMGS=0740405073");
//   serialPort.write("\r");
//   serialPort.write("test message");
//   serialPort.write("\r");
// });

SerialPort.list().then(function (ports) {
  ports.forEach(function (port) {
    console.log("Port: ", port);
  });
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// serialPort.on("open", () => {
//   // serialPort.write("AT+CPIN=0000\r\n");
//   // delay(12000);
//   serialPort.write("AT+CMGF=1\r\n");
//   delay(12000);
//   serialPort.write('AT+CSCS="GSM"\r\n'); // set SMS text mode
//   delay(12000);
//   serialPort.write('AT+CMGS="0740405073"\r\n'); // send sms message
//   delay(12000);
//   serialPort.write("my Test STring\r\n");
//   delay(12000);
//   serialPort.write("\x1A");
//   delay(12000);
//   // serialPort.write("^z");
//   // delay(12000);
// });

serialPort.on("open", async () => {
  serialPort.write("AT+CMGF=1\r\n");
  await delay(2000);
  serialPort.write('AT+CSCS="GSM"\r\n');
  await delay(2000);
  serialPort.write('AT+CMGS="0740405073"\r\n');
  await delay(2000);
  serialPort.write("Luni la 16:30, aveti programare la cabinet\r\n");
  await delay(2000);
  serialPort.write("\x1A");
  await delay(2000);

  // serialPort.write("AT+CMGF=1\r\n");
  // serialPort.write('AT+CSCS="GSM"\r\n');
  // serialPort.write('AT+CMGS="0740405073"\r\n');
  // serialPort.write("my Test STring test test test\r\n");
  // serialPort.write("\x1A");
  //  setTimeout(() => {
  //   serialPort.write("AT+CMGF=1\r\n");
  // }, 10000);
  // setTimeout(() => {
  //   serialPort.write('AT+CSCS="GSM"\r\n');
  // }, 10000);
  // setTimeout(() => {
  //   serialPort.write('AT+CMGS="0740405073"\r\n');
  // }, 10000);
  // setTimeout(() => {
  //   serialPort.write("my Test STring test test test\r\n");
  // }, 10000);
  // setTimeout(() => {
  //   serialPort.write("\x1A");
  // }, 10000);
});

// serialPort.on("open", () => {
//   console.log("Serial port opened");

//   // Send AT command to check if the module is responding
//   serialPort.write("AT\r\n", (err) => {
//     if (err) {
//       console.error("Error writing to serial port:", err.message);
//     }
//   });

//   // Wait for data from the module
//   serialPort.on("data", (data) => {
//     console.log("Received data:", data.toString());

//     // If the module responds correctly, send an SMS
//     if (data.toString().includes("OK")) {
//       // Send SMS
//       serialPort.write("AT+CPIN=0000\r\n");
//       serialPort.write("AT+CMGF=1\r\n"); // Set SMS text mode
//       serialPort.write('AT+CMGS="40751958454"\r\n'); // Replace with the recipient's phone number
//       serialPort.write("Hello, this is a test SMS!\x1A"); // The message text followed by Ctrl+Z (hex 1A)
//     }
//   });
// });

// serialPort.on("open", function () {
//   console.log("Serial communication open");
//   serialPort.write("AT^SYSCFG=13,1,3FFFFFFF,2,4");
//   serialPort.write("\r");
//   serialPort.on("data", function (data) {
//     console.log("Received data: " + data);
//   });
//   gsm_message_sending(serialPort, "test2", "0751958454");
// });

// function gsm_message_sending(serial: any, message: any, phone_no: any) {
//   serial.write("AT+CMGF=1");
//   serial.write("\r");
//   serial.write('AT+CMGS="');
//   serial.write(phone_no);
//   serial.write('"');
//   serial.write("\r");
//   serial.write(message);
//   serial.write("\x1A");
//   serial.write("^z");
// }

declare module "fastify" {
  interface FastifyInstance {
    config: {
      SERVER_PORT: number;
      SERVER_IP_ADDRESS: string;
      UUID_V5_NAMESPACE: string;
      DATABASE_HOST: string;
      DATABASE_PORT: number;
      DATABASE_USERNAME: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      DATABASE_SCHEMA: string;
      REACT_CLIENT_PORT: number;
      REACT_CLIENT_IP_ADDRESS: string;
      ADMIN_ROLE_ID: string;
      DOCTOR_ROLE_ID: string;
      RECEPTIONIST_ROLE_ID: string;
      PATIENT_ROLE_ID: string;
    };
    io: any;
  }
}

export const fastifyServer = Fastify({
  // logger: true,
});

fastifyServer.post("/broadcast-message", async (request, reply) => {
  const { redis } = fastifyServer;
  const body: any = request.body;

  // Publish the message to the message channel
  await redis.publisher.publish(MESSAGE_CHANNEL, body.message);

  return { status: "Message sent successfully" };
});

const buildServer = async () => {
  const corsOptions = {
    origin: "*",
    // origin: "http://192.168.2.16:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  };

  const socketIOOptions = {
    // origin: "*",
    origin: "http://192.168.2.16:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  };

  await fastifyServer.register(fastifyCors, corsOptions);
  await fastifyServer.register(fastifyEnv, options);
  await fastifyServer
    .register(fastifyRedis, {
      host: "127.0.0.1",
      // password: "your strong password here",
      port: 6379,
      family: 4,
      namespace: "sessionRedis",
    })
    .register(fastifyRedis, {
      host: "127.0.0.1",
      // password: "your strong password here",
      port: 6379,
      family: 4,
      namespace: "publisher",
    })
    .register(fastifyRedis, {
      host: "127.0.0.1",
      // password: "your strong password here",
      port: 6379,
      family: 4,
      namespace: "subscriber",
    });
  await fastifyServer.register(cookie, {
    secret: "my-secret", // for cookies signature
    parseOptions: {}, // options for parsing cookies
  } as FastifyCookieOptions);
  await fastifyServer.register(fastifySocketIO, {
    cors: {
      origin: "http://192.168.2.16:3000",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });
  fastifyServer.addHook("onRequest", authenticationMiddleware);
  await fastifyServer.register(authRoutes, { prefix: "api/auth" });
  await fastifyServer.register(userRoutes, { prefix: "api/users" });
  await fastifyServer.register(appointmentRoutes, {
    prefix: "api/appointments",
  });
  await fastifyServer.register(medicalRecordPatientRoutes, {
    prefix: "api/medicalRecordsPatients",
  });
  await fastifyServer;

  // await migrateToDb();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// * sockets
  const { redis } = fastifyServer;

  fastifyServer.io.on("connection", async (socket: any) => {
    console.log(
      `[server#${cluster.worker?.id}]: Client Connected via [server#${cluster.worker?.id}]:`
    );
    const ioHandshake = socket.handshake;

    // console.log(`User connected with ID: ${JSON.stringify(ioHandshake)}`);
    // connectedClients++;
    // console.log(connectedClients);

    // await redis.publisher.publish(
    //   CONNECTION_COUNT_UPDATED_CHANNEL,
    //   String(connectedClients)
    // );

    socket.emit("welcome", "A warm welcome from the server!");

    redis.subscriber.subscribe(MESSAGE_CHANNEL, (err) => {
      if (err) {
        console.error("Error subscribing to channel:", err);
        return;
      }
      console.log(
        `[server#${cluster.worker?.id}]: Client Subscribed to ${MESSAGE_CHANNEL} via [server#${cluster.worker?.id}]:`
      );
    });

    redis.subscriber.on("message", (channel, message) => {
      console.log(
        `[client from server#${cluster.worker?.id}]: Client Received message from ${channel}: ${message} through [server#${cluster.worker?.id}]:`
      );
      socket.emit("message", message);
    });

    socket.on("disconnect", async () => {
      console.log(
        `[server#${cluster.worker?.id}]: Client Disconnected from server#${cluster.worker?.id}:`
      );
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// * /sockets

  fastifyServer.get("/non-blocking", async (request, reply) => {
    const userRepo = new BaseRepository(drizzleInstance, userTable);

    const workerID = cluster.worker
      ? cluster.worker.id
      : "Not in cluster environment";

    console.log(`Request handled by worker #${workerID}`);
    return {
      hello: "world fastify",
      testUser: await userRepo.getById("48631bef-8a77-51ca-b719-dfe17b719081"),
    };
  });

  fastifyServer.get("/blocking", async (request, reply) => {
    const { redis } = fastifyServer;
    let counter = 0;
    for (let i = 0; i < 2_000_000_000; i++) {
      counter = counter + 1;
    }

    const workerID = cluster.worker
      ? cluster.worker.id
      : "Not in cluster environment";

    console.log(`Request handled by worker #${workerID}`);

    return { counter };
  });

  return fastifyServer;
};

async function main() {
  try {
    const fastifyServer = await buildServer();

    const fastifyServerIPAddress = getServerIPAddressEnv();
    const fastifyServerPort = getServerPortEnv();

    console.log(
      `Listening at http://${fastifyServerIPAddress}:${fastifyServerPort}`
    );

    await fastifyServer.listen({
      port: fastifyServerPort,
      host: fastifyServerIPAddress,
    });
  } catch (error) {
    console.log(error);
  }
}

main();

// const numClusterWorkers = 2;
// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);
//   for (let i = 0; i < numClusterWorkers; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) =>
//     console.log(`worker ${worker.process.pid} died`)
//   );

//   cluster.on("online", (worker) => {
//     console.log(
//       `Yay, the worker ${worker.process.pid} responded after it was forked`
//     );
//   });
// } else {
//   try {
//     main();
//   } catch (error) {
//     console.log(error);
//   }
// }
