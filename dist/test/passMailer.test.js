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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const typeorm_1 = require("typeorm");
const storage_1 = require("../src/storage");
const user_1 = __importDefault(require("../src/entity/user"));
const controlFunc_1 = require("./utilities/controlFunc");
const faker_1 = require("@faker-js/faker");
describe("Post to the DB with login", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, storage_1.initStorage)();
        }
        catch (e) {
            console.log(e);
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, typeorm_1.getConnection)()
                .createQueryBuilder()
                .delete()
                .from(user_1.default).execute();
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("When email is not valid should respond with a status code 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            email: faker_1.faker.internet.userName()
        };
        const loginRes = yield (0, controlFunc_1.resetPasswordRequest)(body);
        expect(loginRes.text).toBe("{\"error\":\"Email is not valid\"}");
        expect(loginRes.statusCode).toBe(400);
    }));
    test("When email is valid but not found respond with a status code 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            email: faker_1.faker.internet.email()
        };
        const loginRes = yield (0, controlFunc_1.resetPasswordRequest)(body);
        expect(loginRes.text).toBe("{\"error\":\"User did not found\"}");
        expect(loginRes.statusCode).toBe(400);
    }));
    test("When email valid and found respond with a status code 200 only send", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            username: faker_1.faker.internet.userName(),
            password: faker_1.faker.internet.password(),
            fullName: faker_1.faker.name.findName(),
            email: faker_1.faker.internet.email()
        };
        const registerRes = yield (0, controlFunc_1.registerRequest)(body);
        expect(registerRes.statusCode).toBe(200);
        expect(registerRes.text).toBe("{\"message\":\"Sign up successfully\"}");
        const user = {
            email: body.email
        };
        const loginRes = yield (0, controlFunc_1.resetPasswordRequest)(user);
        expect(loginRes.text).toBe("{\"message\":\"Email send\"}");
        expect(loginRes.statusCode).toBe(200);
    }));
});
