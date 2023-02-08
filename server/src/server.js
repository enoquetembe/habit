"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const env_1 = __importDefault(require("@fastify/env"));
const fastify_bcrypt_1 = __importDefault(require("fastify-bcrypt"));
const routes_1 = require("./lib/routes");
const schema = {
    type: "object",
    required: ["PORT", "JWT_SECRET_KEY", "FRONTEND_URL"],
    properties: {
        PORT: {
            type: "number",
            default: 3000,
        },
        JWT_SECRET_KEY: {
            type: "string",
            default: "e33a6e7a-2682-42a3-bf63-c55b4f9daaec",
        },
        FRONTEND_URL: {
            type: "string",
            default: "http://localhost:5173",
        },
    },
};
const options = {
    schema: schema
};
const app = (0, fastify_1.default)();
app.register(env_1.default, options).then(() => {
    app.register(fastify_bcrypt_1.default, {
        saltWorkFactor: 12
    });
    app.register(cors_1.default, {
        origin: [app.config.FRONTEND_URL],
    });
    app.register(jwt_1.default, {
        secret: app.config.JWT_SECRET_KEY
    });
    app.addHook('preHandler', async (request, reply) => {
        try {
            // make this urls public
            if (!['/signup', '/signin'].includes(request.url)) {
                await request.jwtVerify();
            }
        }
        catch (err) {
            reply.send(err);
        }
    });
    app.register(routes_1.appRoutes);
    app
        .listen({
        host: '0.0.0.0',
        port: app.config.PORT
    })
        .then(() => {
        console.log(`app running in ${app.config.PORT}`);
    });
});
