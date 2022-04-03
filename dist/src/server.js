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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
// Creat the Express application
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ credentials: true, origin: '*' }));
//app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
// Fetch all the routes for the application
const signInSignUp_1 = __importDefault(require("./routes/signInSignUp"));
const userRequest_1 = __importDefault(require("./routes/userRequest"));
const s3_1 = __importDefault(require("./routes/s3"));
function errHandler(err, req, res) {
    res.json({ error: "There is an error in app.js line 21", err });
}
// Routes
app.use('/', signInSignUp_1.default);
app.use('/user', userRequest_1.default);
app.use('/s3', s3_1.default);
//Get all the err without crash
app.use(errHandler);
() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dbngb");
    yield (0, typeorm_1.getConnection)().close();
});
exports.default = app;
