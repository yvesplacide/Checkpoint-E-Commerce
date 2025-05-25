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
    description: "Audio sans fil de haute qualité avec confort optimal.",
    category: "Audio",
    price: 99.99,
    countInStock: 50,
},
  {
    title: "Casque Bleutooth",
    image: "http://localhost:5000/images/casque_orange.png",
    description: "Casque audio sans fil avec son de haute qualité.",
    category: "audio",
    price: 79.99,
    countInStock: 25,
  },
  {
    title: "Television HD",
    image: "http://localhost:5000/images/Television.png",
    description: "Écran haute définition offrant une image claire et nette.",
    category: "Ecran",
    price: 659.99,
    countInStock: 6,
},
{
    title: "Iphone 14 Pro",
    image: "http://localhost:5000/images/iphone14pro.png",
    description: "Smartphone haut de gamme avec écran Super Retina XDR.",
    category: "Telephone",
    price: 439.99,
    countInStock: 9,
},
{
    title: "Macbook Pro ",
    image: "http://localhost:5000/images/makbook_pro.png",
    description: "Ordinateur portable hautes performances avec écran Retina.",
    category: "ordinateur",
    price: 99.99,
    countInStock: 17,
},
 {
    title: "Casque Bluetooth Blanc",
    image: "http://localhost:5000/images/casqueblanc.png",
    description: "Audio sans fil de haute qualité avec confort optimal.",
    category: "Audio",
    price: 99.99,
    countInStock: 50,
},
 {
    title: "Casque Bluetooth Gris",
    image: "http://localhost:5000/images/casquegray.png",
    description: "Audio sans fil de haute qualité avec confort optimal.",
    category: "Audio",
    price: 89.99,
    countInStock: 33,
},
 {
    title: "Redmi C65",
    image: "http://localhost:5000/images/RedmiC65.png",
    description: "Smartphone abordable avec grand écran, batterie longue durée et performante.",
    category: "Telephone",
    price: 399.99,
    countInStock: 41,
},
{
    title: "Montre Rolex",
    image: "http://localhost:5000/images/montre_rolex.png",
    description: "Montre de luxe emblématique alliant précision suisse.",
    category: "montre",
    price: 796.99,
    countInStock: 15,
},
  {
    title: "Montre Omega",
    image: "http://localhost:5000/images/montreOmega.png",
    description: "Montre de prestige alliant innovation horlogère, design sophistiqué.",
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
