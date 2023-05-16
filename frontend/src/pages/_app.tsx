import { GlobalStyle } from "@/components/GlobalStyle";
import Layout from "@/components/Layout";
import { darkTheme } from "@/styles/theme";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <ThemeProvider theme={darkTheme}>
            <GlobalStyle />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </RecoilRoot>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
