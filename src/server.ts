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
        team: "Red Bull Racing",
        nationality: "Netherlands",
        driverNumber: 1
    },
    {
        id: 2,
        name: "Lewis Hamilton",
        team: "Ferrari",
        nationality: "United Kingdom",
        driverNumber: 44,
    },
    {
        id: 3,
        name: "Lando Norris",
        team: "Mclaren",
        nationality: "United Kingdom",
        driverNumber: 4
    },
];

server.get("/teams", async (request, response) => {
    response.type("application/json").code(200);

    return [
        {
            message: "All teams",
            teams
        }
    ]
});

server.get("/drivers", async (request, response) => {
    response.type("application/json").code(200);

    return [
        {
            message: "All drivers",
            drivers
        }
    ]
})

interface DriversProps {
    id?: string;
    name: string;
    team: string;
    nationality: string;
    driverNumber: number;
}

type ParamsDriver = {
    id: string;
}

server.get<{ Params: ParamsDriver }>("/drivers/:id", async (request, response) => {
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
        message: "Driver found!",
        driver: foundDriver
    };
})

server.post<{ Body: DriversProps }>("/drivers", async (request, response) => {
    const { name, nationality, team, driverNumber } = request.body;

    if (!name || !nationality || !team || !driverNumber) {
        response.code(400).send({ error: "Missing required fields " });
    }

    const newDriver = {
        id: drivers.length + 1,
        name,
        nationality,
        team,
        driverNumber
    };

    drivers.push(newDriver);

    return {
        message: "New driver added",
        driver: newDriver
    };
})

server.put<{ Params: ParamsDriver, Body: DriversProps }>("/drivers/:id", async (request, response) => {
    const { id } = request.params;
    const { team, driverNumber, name, nationality } = request.body;

    const driverIndex = drivers.findIndex(searchDriver => searchDriver.id === Number(id));

    if (driverIndex === -1) {
        return response.code(404).send({ error: "Driver not found" });
    }

    drivers[driverIndex] = {
        ...drivers[driverIndex],
        name: name || drivers[driverIndex].name,
        nationality: nationality || drivers[driverIndex].nationality,
        team: team || drivers[driverIndex].team,
        driverNumber: driverNumber || drivers[driverIndex].driverNumber,
    };

    return { message: "Driver updated", driver: drivers[driverIndex] };
})

server.delete<{ Params: ParamsDriver }>("/drivers/:id", async (request, response) => {
    const id = Number(request.params.id);

    const driverIndex = drivers.findIndex(driver => driver.id === id);

    if (driverIndex === -1) {
        return response.type("application/json").code(404).send({ error: "Driver not found" });
    }

    const deletedDriver = drivers.splice(driverIndex, 1);

    return {
        message: "Driver deleted",
        driver: deletedDriver[0]
    };
})

server.listen({
    port: 3333
}, () => {
    console.log("Server running...");
});