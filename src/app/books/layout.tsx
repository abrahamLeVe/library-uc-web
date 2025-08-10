import HeaderMain from "@/components/nav-bar/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderMain />
      <main className="container mx-auto p-2">{children}</main>
    </>
  );
}
