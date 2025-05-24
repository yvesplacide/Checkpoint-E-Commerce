import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import paymentRoutes from './routes/paymentRoutes.js';


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/images', express.static(path.join(__dirname, '/public/images')));

dotenv.config();
connectDB();


app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);


app.get("/", (req, res) => {
  res.send("API e-commerce MERN en ligne 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur sur le http://localhost:${PORT}`));
