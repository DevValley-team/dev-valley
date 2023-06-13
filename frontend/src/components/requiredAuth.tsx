import { accessTokenState } from "@/recoil/user";
import { useRouter } from "next/router";
import { ComponentType, useEffect } from "react";
import { useRecoilState } from "recoil";

const requiredAuth = (Component: ComponentType<any>) => (props: any) => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(accessTokenState);
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, []);

  return <Component {...props} />;
};

export default requiredAuth;
