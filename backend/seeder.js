import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

// --- Données de test ---
const products = [
  {
    title: "Casque Bluetooth TechTok",
    image: "http://localhost:5000/images/casque_TechTok.png",
    description: "Casque sans fil avec réduction de bruit active",
    category: "Audio",
    price: 99.99,
    countInStock: 50,
},
  {
    title: "Casque Bleutooth",
    image: "http://localhost:5000/images/casque_orange.png",
    description: "Clavier mécanique rétroéclairé RGB",
    category: "audio",
    price: 79.99,
    countInStock: 25,
  },
  {
    title: "Television HD",
    image: "http://localhost:5000/images/Television.png",
    description: "Casque sans fil avec réduction de bruit active",
    category: "Ecran",
    price: 99.99,
    countInStock: 6,
},
{
    title: "Iphone 14 Pro",
    image: "http://localhost:5000/images/iphone14pro.png",
    description: "Casque sans fil avec réduction de bruit active",
    category: "Telephone",
    price: 99.99,
    countInStock: 9,
},
{
    title: "Macbook Pro ",
    image: "http://localhost:5000/images/makbook_pro.png",
    description: "Casque sans fil avec réduction de bruit active",
    category: "ordinateur",
    price: 99.99,
    countInStock: 17,
},
{
    title: "Montre Rolex",
    image: "http://localhost:5000/images/montre_rolex.png",
    description: "Casque sans fil avec réduction de bruit active",
    category: "montre",
    price: 99.99,
    countInStock: 15,
},
  {
    title: "Montre Omega",
    image: "http://localhost:5000/images/montreOmega.png",
    description: "Écran 4K Ultra HD 27 pouces pour gaming et design",
    category: "montre",
    price: 249.99,
    countInStock: 10,
    
  }
];

// --- Fonction principale ---
const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(products);

    console.log("✅ Produits importés avec succès !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur :", error);
    process.exit(1);
  }
};
importData();
