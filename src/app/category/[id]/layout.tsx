import HeaderMain from "@/components/nav-bar/header";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <HeaderMain id={id} />
      <main className="container mx-auto p-2">{children}</main>
    </>
  );
}
