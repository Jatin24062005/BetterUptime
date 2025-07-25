import express from "express";
import dotenv from "dotenv";
import { prisma } from "store"

dotenv.config();

const app = express();

app.post("/website", async (req,res) => {
  const website = await prisma.website.create({
    data: { url : req.body.url ,
      timeAdded: new Date(),
    }
  }); 
  res.status(201).json({
    message: "Website created successfully",
    id: website.id,
  });
});

app.get("/status/:websiteId", (req, res) => {
  const { websiteId } = req.params;
  res.send(`Status of website ${websiteId}`);
});

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});
