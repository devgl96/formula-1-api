import { FastifyInstance } from "fastify";
import { ParamsProps, TeamsProps } from "../types";
import { teams } from "../data/teams";

export default async function teamsRoutes(fastify: FastifyInstance) {

    fastify.get("/", async (request, response) => {
        response.type("application/json").code(200);

        return [
            {
                message: "All teams",
                teams
            }
        ]
    });

    fastify.get<{ Params: ParamsProps }>("/:id", async (request, response) => {
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

    fastify.post<{ Body: TeamsProps }>("/", async (request, response) => {
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

    fastify.put<{ Params: ParamsProps, Body: TeamsProps }>("/:id", async (request, response) => {
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

    fastify.delete<{ Params: ParamsProps }>("/:id", async (request, response) => {
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
}