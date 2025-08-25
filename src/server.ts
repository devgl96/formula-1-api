import fastify from 'fastify';
import cors from "@fastify/cors";

const server = fastify({ logger: true });

server.register(cors, {
    origin: "*", 
});

const teams = [
    {
        id: 1,
        name: "ferrari",
        base: "Maranello, Italy"
    },
    {
        id: 2,
        name: "Mclaren",
        base: "Woking, United Kingdom"
    },
    {
        id: 3,
        name: "Mercedes",
        base: "Brackley, United Kingdom"
    },
];

const drivers = [
    {
        id: 1,
        name: "Max Verstappen",
        team: "Red Bull Racing"
    },
    {
        id: 2,
        name: "Lewis Hamilton",
        team: "Mercedes"
    },
    {
        id: 2,
        name: "Lando Norris",
        team: "Mclaren"
    },
];

server.get("/teams", async (request, response) => {
    response.type("application/json").code(200);

    return [
        {
            teams
        }
    ]
});

server.get("/drivers", async (request, response) => {
    response.type("application/json").code(200);

    return [
        {
            drivers
        }
    ]
})

interface DriversParams {
    id: string;
}

server.get<{ Params: DriversParams }>("/drivers/:id", async (request, response) => {
    const id = Number(request.params.id);

    const foundDriver = drivers.find(driver => driver.id === id);

    if (!foundDriver) {
        response.type("application/json").code(404);

        return {
            message: "Driver not found!"
        }
    }

    response.type("application/json").code(200);

    return {
        driver: foundDriver
    };
})

server.listen({
    port: 3333
}, () => {
    console.log("Server running...");
});