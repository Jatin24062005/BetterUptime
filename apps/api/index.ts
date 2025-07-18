import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.post("/website", async (req,res) => {
  res.send("Received a POST request");
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
