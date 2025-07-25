import express from "express";
import dotenv from "dotenv";
import { prismaClient } from "store";
import { AuthInput } from "./types";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middlware/middleware";
import { ExitStatus } from "typescript";
import { startTransition } from "react";

dotenv.config();

const app = express();

app.post("/website", authMiddleware, async (req, res) => {
  if(!req.body.url){
    res.status(400).json({
      status:"Missing Url"
    })
  }

  const website = await prismaClient.website.create({
    data: { url: req.body.url, timeAdded: new Date(),userId :req.userId!},
  });
  res.status(201).json({
    message: "Website created successfully",
    id: website.id,
  });
});

app.get("/status/:websiteId", authMiddleware,async (req, res) => {
  const { websiteId } = req.params;

 const website = await prismaClient.website.findFirst({
    where:{
      userId: req.userId,
      id:websiteId,
    },
    include:{
      ticks:{
        orderBy:[{
          createdAt:'desc'
        }],
        take:1
      }
    }
  })

  if(!website){
    res.send(400).json({
      status:"failed",
      message:"Website not found"
    })
  }

  res.send(200).json({
    status:"Success",
    message:"WebSite status found successfully",
    website
  })
  
});

app.post("/user/signup", async (req, res) => {
  const data = AuthInput.safeParse(req.body);

  if (!data.success) {
    return res.status(400).json({
      status: "failed",
      message: "Credentials required!",
    });
  }

  const { username, password } = data.data;

  try {
    const user = await prismaClient.user.findFirst({
      where: { username },
    });

    if (user) {
      return res.status(409).json({
        status: "failed",
        message: "User already exists!",
      });
    }

    const newUser = await prismaClient.user.create({
      data: {
        username,
        password, // 🔐 hash this in real apps
      },
    });

    return res.status(201).json({
      status: "success",
      message: "User created!",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
});

app.post("user/signin", async (req, res) => {
  const data = req.body;
  if (!data.success) {
    res.status(400).json({
      status: "failed",
      message: "Credential Requires !",
    });
  }
  const { username, password } = data.data;
  const user = await prismaClient.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user) {
    res.status(401).json({
      status: "failed",
      message: "User Not exists!",
    });
  }

  if (user?.password != password) {
    res.status(402).json({
      status: "failed",
      message: "Incorrect Password!",
    });
  }
  const token = jwt.sign(
    { id: user?.id, username: user?.username },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );
  res.status(200).json({
    status: "Success",
    message: "User Login SuccessFUlly!",
    token,
  });
});

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 3000}`
  );
});
