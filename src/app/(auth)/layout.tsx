import { ModeToggle } from "@/components/toggle";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <nav className="bg-gray-950">
          <div className="container flex flex-wrap items-center justify-between md:h-20 p-1 m-auto gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl md:text-4xl font-semibold border-b pb-1 text-blue-50">
                Biblioteca Torres Lara
              </h1>
            </div>

            <div className="ml-auto">
              <ModeToggle />
            </div>
          </div>
        </nav>
        <Separator className="mb-2.5" />
      </header>
      <main className="flex flex-col w-full items-center p-1">{children}</main>
    </>
  );
}
