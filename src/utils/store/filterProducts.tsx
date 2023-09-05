import { PriceRange } from "../../components/Store/PriceSetter";
import { ArrayData, FetchedProductData, allCathegoriesSelectorName } from "../../pages/store/StoreLayout";
import { CurrenciesMap, getCurrencyRate } from "../currencyUtils";
//filters an array of product data based on optional search value, cathegory, and price range arguments.
export default function filterProducts(
  data: ArrayData,
  currenciesMap: CurrenciesMap,
  selectedCurrency: string,
  searchVal?: string,
  cathegory?: string,
  priceRange?: PriceRange
): ArrayData {
  let result = JSON.parse(JSON.stringify(data));
  if (searchVal !== undefined) {
    result = result.filter((product: FetchedProductData) => {
      return product.data.name.toLowerCase().includes(searchVal.toLowerCase().trim());
    });
  }
  if (cathegory !== undefined && cathegory.length > 0 && cathegory !== allCathegoriesSelectorName) {
    result = result.filter((product: FetchedProductData) => product.data.cathegory === cathegory);
  }
  if (priceRange !== undefined) {
    result = result.filter((product: FetchedProductData) => {
      const rating = getCurrencyRate(product.data.currency, selectedCurrency, currenciesMap) || 1;
      if (product.data.discount && product.data.discount_price) {
        const price = product.data.discount_price * rating;
        if (price >= priceRange.minPrice && price <= priceRange.maxPrice) {
          return product;
        }
      } else if (product.data.price) {
        const price = product.data.price * rating;
        if (price >= priceRange.minPrice && price <= priceRange.maxPrice) {
          return product;
        }
      }
    });
  }
  return result;
}
