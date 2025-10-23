import { fetchFacultadesByBooks } from "@/lib/data/faculty.data";
import HeaderNav from "./header-nav";

export const revalidate = 60;

export default async function HeaderMain() {
  const facultades = await fetchFacultadesByBooks();

  return (
    <>
      <HeaderNav facultades={facultades} />
    </>
  );
}
