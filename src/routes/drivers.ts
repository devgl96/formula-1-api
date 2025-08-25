import { FastifyInstance } from "fastify";
import { drivers } from "../data/drivers";
import { ParamsProps, DriversProps } from "../types";

export default async function driversRoutes(fastify: FastifyInstance) {
    fastify.get("/", async (request, response) => {
        response.type("application/json").code(200);

        return [
            {
                message: "All drivers",
                drivers
            }
        ]
    })

    fastify.get<{ Params: ParamsProps }>("/:id", async (request, response) => {
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

    fastify.post<{ Body: DriversProps }>("/", async (request, response) => {
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

    fastify.put<{ Params: ParamsProps, Body: DriversProps }>("/:id", async (request, response) => {
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

    fastify.delete<{ Params: ParamsProps }>("/:id", async (request, response) => {
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
}