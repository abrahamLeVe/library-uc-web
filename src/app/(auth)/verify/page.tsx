import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import VerifyForm from "@/components/user/verify-form";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page(props: {
  searchParams?: Promise<{
    email?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email || "";

  return (
    <>
      <div className="container flex  w-full  h-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="pointer-events-none cursor-not-allowed"
                >
                  Inicio
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Verificar cuenta</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="w-full max-w-sm ">
        <Suspense fallback={<p>Cargando...</p>}>
          <VerifyForm email={email} />
        </Suspense>
      </div>
    </>
  );
}
