import Footer from "@/components/footer/footer-index";
import HeaderMain from "@/components/nav-bar/header-main";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderMain />
      <main className="container mx-auto p-2">{children}</main>
      <Footer />
    </>
  );
}
