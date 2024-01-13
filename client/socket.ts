import { io } from "socket.io-client";

const URL = "http://192.168.2.16:40587";

export const socket = io(URL);
