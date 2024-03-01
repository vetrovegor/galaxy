import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.use('/api/v1/user-ms', proxy(process.env.USER_MS_URL));
app.use('/api/v1/product-ms', proxy(process.env.PRODUCT_MS_URL));
app.use('/api/v1/review-ms', proxy(process.env.REVIEW_MS_URL));

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API с Swagger',
            version: '1.0.0',
            description: 'Пример использования Swagger в Express',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Локальный сервер',
            }
        ]
    },
    apis: []
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));