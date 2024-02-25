import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// переименовать на user-ms
app.use('/api/v1/user', proxy(process.env.USER_MS_URL));
app.use('/api/v1/product-ms', proxy(process.env.PRODUCT_MS_URL));
app.use('/api/v1/review-ms', proxy(process.env.REVIEW_MS_URL));

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));