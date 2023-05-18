import { Express, Router } from "express";
import { API_ENDPOINT } from "../constants";
import axios from "axios";
import to from "await-to-js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const result = await axios.post(
      API_ENDPOINT + "/api/auth/login",
      req.body,
      {
        withCredentials: true,
      }
    );
    const { accessToken, refreshToken } = result.data;

    if (accessToken && refreshToken) {
      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshToken;

      await new Promise<void>((resolve) => req.session.save(() => resolve()));

      return res.status(200).json({ accessToken });
    } else {
      return res.status(400).json({ error: "Login Failed" });
    }
  } catch (error) {
    res.status(401).json({ message: "Login Failed" });
  }
});

router.get("/refresh", async (req, res) => {
  if (!req.session.refreshToken) {
    return res.status(200).json({
      error: "Error: RefreshToken is not exist.",
    });
  }

  const [err, result] = await to(
    axios.post(API_ENDPOINT + "/api/auth/refresh", {
      refreshToken: req.session.refreshToken,
    })
  );

  if (result?.data?.accessToken && result?.data?.refreshToken) {
    req.session.accessToken = result.data.accessToken;
    req.session.refreshToken = result.data.refreshToken;

    await new Promise<void>((resolve) => req.session.save(() => resolve()));

    return res.status(200).json({
      accessToken: result?.data.accessToken,
    });
  } else {
    await new Promise<void>((resolve) => req.session.destroy(() => resolve()));

    return res.status(400).json({
      error: "Error: Token Refresh Failed",
    });
  }
});

router.get("/logout", async (req, res) => {
  await new Promise<void>((resolve) => req.session.destroy(() => resolve()));

  return res.status(200).json({});
});

export default router;
