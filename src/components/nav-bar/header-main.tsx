import { fetchFacultades } from "@/lib/data/facultad.data";
import HeaderNav from "./header-nav";

export const revalidate = 60;

export default async function HeaderMain() {
  const facultades = await fetchFacultades();

  return (
    <>
      <HeaderNav facultades={facultades} />
    </>
  );
}
