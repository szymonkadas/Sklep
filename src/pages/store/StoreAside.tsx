import CathegoriesFilter from "../../components/Store/CathegoriesFilter";
import PriceSetter, { PriceRange } from "../../components/Store/PriceSetter";
import Searchbar from "../../components/Store/Searchbar";
import { CurrenciesMap } from "../../utils/currencyUtils";
import { ArrayData, FetchedProductData } from "./StoreLayout";

export type StoreAsideProps = {
  filteredProducts: ArrayData;
  currenciesMap: CurrenciesMap;
  defaultPriceRange: PriceRange;
  clearFilters: () => void;
};
const StoreAside = function (props: StoreAsideProps) {
  // provides filtered cathegories with their unique product quantity.
  const filteredCathegoriesProductMap = new Map<string, number>();
  props.filteredProducts.forEach((product: FetchedProductData) => {
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
      <Searchbar currenciesMap={props.currenciesMap}></Searchbar>
      <PriceSetter currenciesMap={props.currenciesMap} defaultPriceRange={props.defaultPriceRange}></PriceSetter>
      <CathegoriesFilter filteredCathegoriesProductMap={filteredCathegoriesProductMap}></CathegoriesFilter>
    </aside>
  );
};

export default StoreAside;
