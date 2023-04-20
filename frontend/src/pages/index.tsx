import Seo from "@/components/Seo";
import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  const checkExpress = async () => {
    try {
      const res = await axios.get("/getRequest");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkExpress();
  });
  return (
    <>
      <Seo title="Home" />
      <div>Home</div>
    </>
  );
}
