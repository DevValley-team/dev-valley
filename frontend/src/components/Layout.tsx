import TopNav from "./TopNav";

interface ILayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
  return (
    <>
      <TopNav />
      {children}
    </>
  );
}
