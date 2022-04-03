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
exports.initStorage = void 0;
const typeorm_1 = require("typeorm");
function initStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, typeorm_1.createConnection)({
            type: 'postgres',
            host: process.env.PG_HOST,
            port: parseInt(process.env.PG_PORT),
            username: process.env.PG_USER,
            password: process.env.PG_PASS,
            database: process.env.PG_DB,
            entities: [__dirname + '/entity/*{.ts,.js}'],
            synchronize: true,
            //logging: true
        });
    });
}
exports.initStorage = initStorage;
;
