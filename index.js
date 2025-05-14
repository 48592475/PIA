import express from "express";
import cors from "cors";
import "dotenv/config";
import dotenv from 'dotenv';
dotenv.config();
const web = express();

web.use(express.json());
web.use(cors());

web.get("/", (_, res) => res.send("PIA API esta corriendo..."));
web.listen(process.env.PORT || 3000 , () => 
    console.log(`Servidor corriendo en puerto ${process.env.PORT || 3000}`)
)