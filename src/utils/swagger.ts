import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import logger from "./logger";
const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "World Academia API",
            description: "Welcome to the My RESTful Server API, a comprehensive and flexible platform designed for managing university-related data. This API allows you to perform CRUD (Create, Read, Update, Delete) operations on universities, enabling easy management and retrieval of educational institutions.",
            version: "1.9.0"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.routes.ts", "./src/schema/*.schema.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
    // Swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

   
}

export default swaggerDocs;
