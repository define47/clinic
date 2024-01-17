"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.migrateToDb = exports.drizzleInstance = exports.clinicSchema = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg = __importStar(require("pg"));
const { Pool } = pg;
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.clinicSchema = (0, pg_core_1.pgSchema)("iatropolis");
const pool = new Pool({
    host: "127.0.0.1",
    port: 5432,
    user: "tudorpostgresql",
    password: "tudorpostgresqlpassword",
    database: "clinicdb",
});
exports.drizzleInstance = (0, node_postgres_1.drizzle)(pool);
function migrateToDb() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, migrator_1.migrate)(exports.drizzleInstance, { migrationsFolder: "drizzle" });
    });
}
exports.migrateToDb = migrateToDb;
