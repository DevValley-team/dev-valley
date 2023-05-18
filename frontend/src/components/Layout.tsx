import { useEffect } from "react";
import TopNav from "./TopNav";
import { useRecoilState } from "recoil";
import { accessTokenState, userInfoState } from "@/recoil/user";
import axios from "axios";

interface ILayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
  // refresh user
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const getUserInfo = async (token: string) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((user) => {
        setUserInfo({
          id: user.data.id,
          email: user.data.email,
          nickname: user.data.nickname,
          experience: user.data.experience,
          role: user.data.role,
          lastLoginAt: user.data.lastLoginAt,
          createdAt: user.data.createdAt,
          updatedAt: user.data.updatedAt,
        });
      });
  };

  useEffect(() => {
    (async () => {
      try {
        await axios
          .get("/api/auth/refresh", { withCredentials: true })
          .then((res) => {
            setAccessToken(res.data.accessToken);
            if (res.status !== 203) {
              getUserInfo(res.data.accessToken);
            }
          });
      } catch (e) {
        alert(e);
      }
    })();
  }, []);

  return (
    <>
      <TopNav />
      {children}
    </>
  );
}
