import { Router } from "express";
import { API_ENDPOINT } from "../constants";
import axios, { AxiosRequestConfig } from "axios";

const router = Router();

router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  const sessionId = req.headers.sid?.slice(16, 48);
  req.sessionStore.get(String(sessionId), async (err, data: any) => {
    if (err) {
      console.log(err);
    }
    let accessToken = data?.accessToken;
    try {
      let config: AxiosRequestConfig = {};
      // accessToken 이 있을 때만 토큰을 넣어서 보냄
      if (accessToken) {
        config.headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }
      const response = await axios.get(
        API_ENDPOINT + `/api/posts/${postId}`,
        config
      );
      return res.status(200).json(response.data);
    } catch (error) {
      res.status(401).json({ message: "Post Error" });
    }
  });
});

export default router;
