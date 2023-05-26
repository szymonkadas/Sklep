import CathegoriesFilter from "../../components/Store/CathegoriesFilter";
import PriceSetter from "../../components/Store/PriceSetter";
import Searchbar from "../../components/Store/Searchbar";
import { arrayData, fetchedProductData } from "./StoreLayout";
export type storeAsideProps = {
  filteredProducts: arrayData;
  clearFilters: () => void;
};
const StoreAside = function (props: storeAsideProps) {
  // provides filtered cathegories with their unique product quantity.
  const filteredCathegoriesProductMap = new Map<string, number>();
  props.filteredProducts.forEach((product: fetchedProductData) => {
    if (filteredCathegoriesProductMap.has(product.data.cathegory)) {
      filteredCathegoriesProductMap.set(
        product.data.cathegory,
        filteredCathegoriesProductMap.get(product.data.cathegory)! + 1
        // using ! so typescript believes me that it is indeed not undefined.
      );
    } else {
      filteredCathegoriesProductMap.set(product.data.cathegory, 1);
    }
  });

  return (
    <aside className="store-aside">
      <button onClick={() => props.clearFilters()}>Clear filters</button>
      <Searchbar></Searchbar>
      <PriceSetter></PriceSetter>
      <CathegoriesFilter filteredCathegoriesProductMap={filteredCathegoriesProductMap}></CathegoriesFilter>
    </aside>
  );
};

export default StoreAside;
