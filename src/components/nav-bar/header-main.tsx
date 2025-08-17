import { fetchCategoriasPadre } from "@/lib/data/category.data";
import HeaderNav from "./header-nav";

export const revalidate = 60;

export default async function HeaderMain() {
  const categorias = await fetchCategoriasPadre();
  return <HeaderNav categorias={categorias} />;
}
