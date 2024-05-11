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
const express_1 = __importDefault(require("express"));
const supabase_js_1 = require("@supabase/supabase-js");
const morgan_1 = __importDefault(require("morgan"));
const helper_1 = require("./helper");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("combined"));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.PORT || 4000;
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_PROJECT_URL || "", process.env.SUPABASE_API_KEY || "");
app.get("/contacts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase
        .from("contacts")
        .select(`*, messages(*)`);
    const dataHasMessages = data === null || data === void 0 ? void 0 : data.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.messages) === null || _a === void 0 ? void 0 : _a.length) === 0; });
    res.send(dataHasMessages);
}));
app.get("/contact-chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase
        .from("contacts")
        .select(`*, messages(*)`);
    const dataHasMessages = data === null || data === void 0 ? void 0 : data.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.messages) === null || _a === void 0 ? void 0 : _a.length) > 0; });
    res.send(dataHasMessages);
}));
app.get("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.query;
    const cursor = params.cursor;
    const queryParams = (0, helper_1.decodeBase64ToObject)(cursor);
    const { data, error } = yield supabase
        .from("messages")
        .select("*, contacts(*)")
        .eq("contact_id", queryParams === null || queryParams === void 0 ? void 0 : queryParams.userId)
        .range((queryParams === null || queryParams === void 0 ? void 0 : queryParams.offset) - 1 || 0, (queryParams === null || queryParams === void 0 ? void 0 : queryParams.limit) - 1 || 0)
        .order('id', { ascending: false });
    res.send(data);
}));
app.post("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { data, error } = yield supabase
        .from("messages")
        .insert({
        contact_id: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.contact_id,
        message: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.message,
        created_at: (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.created_at,
        is_owner: (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.is_owner,
    })
        .select();
    if (error) {
        res.send(error);
    }
    res.send({
        isSuccess: true,
        data,
    });
}));
app.get("/", (req, res) => {
    res.send("API Chat!");
});
app.get("*", (req, res) => {
    res.send("API Not Found");
});
app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
});
