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
    test("When username is missing should respond with a status code of 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            username: "",
            password: faker_1.faker.internet.password()
        };
        const loginRes = yield (0, controlFunc_1.loginRequest)(body);
        expect(loginRes.text).toBe("{\"error\":\"Email or Password are incorrect\"}");
        expect(loginRes.statusCode).toBe(400);
    }));
    test("When password is missing should respond with a status code of 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            username: faker_1.faker.internet.userName(),
            password: ""
        };
        const loginRes = yield (0, controlFunc_1.loginRequest)(body);
        expect(loginRes.text).toBe("{\"error\":\"Email or Password are incorrect\"}");
        expect(loginRes.statusCode).toBe(400);
    }));
    test("When login but give wrong password should respond with a status code of 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            username: faker_1.faker.internet.userName(),
            password: faker_1.faker.internet.password(),
            fullName: faker_1.faker.name.findName(),
            email: faker_1.faker.internet.email()
        };
        const registerRes = yield (0, controlFunc_1.registerRequest)(body);
        expect(registerRes.statusCode).toBe(200);
        const user = {
            username: body.username,
            password: faker_1.faker.internet.password()
        };
        const loginRes = yield (0, controlFunc_1.loginRequest)(user);
        expect(loginRes.text).toBe("{\"error\":\"Email or Password are incorrect\"}");
        expect(loginRes.statusCode).toBe(401);
    }));
    test("When login but give wrong username should respond with a status code of 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            username: faker_1.faker.internet.userName(),
            password: faker_1.faker.internet.password(),
            fullName: faker_1.faker.name.findName(),
            email: faker_1.faker.internet.email()
        };
        const registerRes = yield (0, controlFunc_1.registerRequest)(body);
        expect(registerRes.statusCode).toBe(200);
        const user = {
            username: faker_1.faker.internet.userName(),
            password: body.password
        };
        const loginRes = yield (0, controlFunc_1.loginRequest)(user);
        expect(loginRes.text).toBe("{\"error\":\"Email or Password are incorrect\"}");
        expect(loginRes.statusCode).toBe(401);
    }));
    test("When login should respond with a status code of 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            username: faker_1.faker.internet.userName(),
            password: faker_1.faker.internet.password(),
            fullName: faker_1.faker.name.findName(),
            email: faker_1.faker.internet.email()
        };
        const registerRes = yield (0, controlFunc_1.registerRequest)(body);
        expect(registerRes.statusCode).toBe(200);
        const user = {
            username: body.username,
            password: body.password
        };
        const loginRes = yield (0, controlFunc_1.loginRequest)(user);
        expect(loginRes.statusCode).toBe(200);
    }));
    test("When login with google should respond with a status code of 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            name: faker_1.faker.internet.userName(),
            email: faker_1.faker.internet.email()
        };
        for (let i = 0; i < 2; i++) {
            const res = yield (0, controlFunc_1.googleRequest)(body);
            expect(res.statusCode).toBe(200);
        }
        ;
    }));
});
