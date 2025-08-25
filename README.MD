# 🏁API de Fórmula 1

Este projeto é um exemplo de como organizar uma API usando **Fastify**
com **TypeScript**, aplicando boas práticas de estruturação de pastas e
modularização.

------------------------------------------------------------------------

## Exemplo de Modelos (Models)

### `models/Driver.ts`

``` ts
export interface Driver {
  id: number;
  name: string;
  team: string;
  nationality: string;
}
```

### `models/Team.ts`

``` ts
export interface Team {
  id: number;
  name: string;
  base: string;
}
```

### `models/Race.ts`

``` ts
export interface Race {
  id: number;
  location: string;
  date: string;
}
```

------------------------------------------------------------------------

## Exemplo de Serviços (Services)

### `services/driversService.ts`

``` ts
import { Driver } from "../models/Driver";

const drivers: Driver[] = [
  { id: 1, name: "Lewis Hamilton", team: "Mercedes", nationality: "British" },
  { id: 2, name: "Max Verstappen", team: "Red Bull", nationality: "Dutch" },
];

export const getDrivers = (): Driver[] => drivers;

export const getDriverById = (id: number): Driver | undefined =>
  drivers.find(driver => driver.id === id);
```

------------------------------------------------------------------------

## Exemplo de Controllers

### `controllers/driversController.ts`

``` ts
import { FastifyReply, FastifyRequest } from "fastify";
import * as driverService from "../services/driversService";

export const getDrivers = async (req: FastifyRequest, reply: FastifyReply) => {
  const drivers = driverService.getDrivers();
  reply.send(drivers);
};

export const getDriverById = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const driver = driverService.getDriverById(Number(id));
  if (!driver) {
    reply.status(404).send({ message: "Driver not found" });
  } else {
    reply.send(driver);
  }
};
```

------------------------------------------------------------------------

## Exemplo de Rotas

### `routes/driversRoutes.ts`

``` ts
import { FastifyInstance } from "fastify";
import * as driversController from "../controllers/driversController";

export default async function driverRoutes(fastify: FastifyInstance) {
  fastify.get("/drivers", driversController.getDrivers);
  fastify.get("/drivers/:id", driversController.getDriverById);
}
```

------------------------------------------------------------------------

## Configuração do Servidor

### `app.ts`

``` ts
import Fastify from "fastify";
import driverRoutes from "./routes/driversRoutes";

const app = Fastify();

app.register(driverRoutes);

export default app;
```

### `server.ts`

``` ts
import app from "./app";

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("🚀 Server running at http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
```

------------------------------------------------------------------------

## Scripts no `package.json`

``` json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

------------------------------------------------------------------------

## Execução do Projeto

1.  Instale as dependências:

    ``` bash
    npm install fastify ts-node-dev typescript @types/node
    ```

2.  Inicie em modo desenvolvimento:

    ``` bash
    npm run dev
    ```

3.  Compile o projeto:

    ``` bash
    npm run build
    ```

4.  Rode em produção:

    ``` bash
    npm start
    ```

------------------------------------------------------------------------

## Endpoints Atuais
### Drivers
-   `GET /drivers` → lista todos os pilotos
-   `GET /drivers/:id` → retorna informações de um piloto específico
-   `POST /drivers` → adiciona um novo piloto
-   `PUT /drivers/:id` → atualiza informações de um piloto
-   `DELETE /drivers/:id` → remove um piloto

### Teams
-   `GET /teams` → lista todas as equipes
-   `GET /teams/:id` → retorna informações de um equipe específico
-   `POST /teams` → adiciona um novo equipe
-   `PUT /teams/:id` → atualiza informações de um equipe
-   `DELETE /teams/:id` → remove um equipe
