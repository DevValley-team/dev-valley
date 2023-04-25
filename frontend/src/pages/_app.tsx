import { GlobalStyle } from "@/components/GlobalStyle";
import Layout from "@/components/Layout";
import { darkTheme } from "@/styles/theme";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <RecoilRoot>
        <ThemeProvider theme={darkTheme}>
          <GlobalStyle />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </RecoilRoot>
    </>
  );
}
