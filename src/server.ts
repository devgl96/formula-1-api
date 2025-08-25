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

interface TeamsProps {
    name: string;
    base: string;
}

interface DriversProps {
    id?: string;
    name: string;
    team: string;
    nationality: string;
    driverNumber: number;
}

type ParamsProps = {
    id: string;
}

server.get("/teams", async (request, response) => {
    response.type("application/json").code(200);

    return [
        {
            message: "All teams",
            teams
        }
    ]
});

server.get<{ Params: ParamsProps }>("/teams/:id", async (request, response) => {
    const { id } = request.params;

    const teamById = teams.find(team => team.id === Number(id));

    if (teamById) {
        return response.code(200).send({
            message: "Team found!",
            team: teamById
        });
    }

    return response.code(404).send({
        error: "Team not found!"
    });
})

server.post<{ Body: TeamsProps }>("/teams", async (request, response) => {
    const { base, name } = request.body;

    if (!base.length || !name.length) {
        return response.code(400).send({
            error: "Missing required fields!"
        })
    }

    const newTeam = {
        base,
        name
    };

    teams.push({
        id: teams.length + 1,
        ...newTeam
    });

    return response.code(200).send({
        message: "Team created!",
        team: newTeam
    });
})

server.put<{ Params: ParamsProps, Body: TeamsProps }>("/teams/:id", async (request, response) => {
    const { id } = request.params;
    const { base, name } = request.body;

    const indexTeam = teams.findIndex(team => team.id === Number(id));

    if (indexTeam === -1) {
        return response.code(404).send({
            error: "Team not found!"
        });
    }

    teams[indexTeam] = {
        ...teams[indexTeam],
        base: base || teams[indexTeam].base,
        name: name || teams[indexTeam].name,
    };

    return response.code(200).send({
        message: "Team updated",
        team: teams[indexTeam]
    });
})

server.delete<{ Params: ParamsProps }>("/teams/:id", async (request, response) => {
    const { id } = request.params;

    const teamIndexById = teams.findIndex(team => team.id === Number(id));

    if (teamIndexById === -1) {
        return response.code(404).send({
            error: "Team not found!",
        });
    }

    const deletedTeam = teams.splice(teamIndexById, 1);

    return response.code(200).send({
        message: "Team deleted!",
        team: deletedTeam[0]
    });
})

server.get("/drivers", async (request, response) => {
    response.type("application/json").code(200);

    return [
        {
            message: "All drivers",
            drivers
        }
    ]
})

server.get<{ Params: ParamsProps }>("/drivers/:id", async (request, response) => {
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

server.put<{ Params: ParamsProps, Body: DriversProps }>("/drivers/:id", async (request, response) => {
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

server.delete<{ Params: ParamsProps }>("/drivers/:id", async (request, response) => {
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