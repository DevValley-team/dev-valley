import { useEffect } from "react";
import TopNav from "./TopNav";
import { useRecoilState } from "recoil";
import { accessTokenState } from "@/recoil/user";
import axios from "axios";

interface ILayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
  // refresh user
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  useEffect(() => {
    (async () => {
      try {
        await axios
          .get("/api/auth/refresh", { withCredentials: true })
          .then((res) => {
            setAccessToken(res.data.accessToken);
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
