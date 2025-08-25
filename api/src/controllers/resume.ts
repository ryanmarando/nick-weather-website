import { RequestHandler } from "express";
import { prisma } from "../config"


export const getAllResumeImages: RequestHandler = async (req, res) => {
    console.log("Hi")
    res.status(200).json({message: "Hit Resume"});
    return;
  };