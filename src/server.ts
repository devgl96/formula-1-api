import fastify from 'fastify';
import cors from "@fastify/cors";
import driversRoutes from './routes/drivers';
import teamsRoutes from './routes/teams';

const server = fastify({ logger: true });

server.register(cors, {
    origin: "*",
});

server.register(driversRoutes, { prefix: "/drivers"});
server.register(teamsRoutes, { prefix: "/teams"});

server.listen({
    port: 3333
}, () => {
    console.log("Server running...");
});