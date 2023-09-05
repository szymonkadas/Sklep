import { PriceRange } from "../../components/Store/PriceSetter";
import { ArrayData, FetchedProductData } from "../../pages/store/StoreLayout";
import { CurrenciesMap, formatPrice, getCurrencyRate } from "../currencyUtils";
// this function calculates and returns the minimum and maximum prices for a given array of product data, with an optional filter for a specific category.
export default function getPriceRange(
  productsData: ArrayData,
  currenciesMap: CurrenciesMap,
  selectedCurrency: string,
  cathegory?: string
): PriceRange {
  let dataCopy = JSON.parse(JSON.stringify(productsData));
  const result = dataCopy.reduce(
    (accumulator: PriceRange, currVal: FetchedProductData) => {
      const rating = getCurrencyRate(currVal.data.currency, selectedCurrency, currenciesMap) || 1;
      if (cathegory && currVal.data.cathegory !== cathegory) return accumulator;
      if (currVal.data.discount && currVal.data.discount_price) {
        const price = currVal.data.discount_price * rating;
        return minMax(accumulator.minPrice, accumulator.maxPrice, price);
      } else if (currVal.data.price) {
        const price = currVal.data.price * rating;
        return minMax(accumulator.minPrice, accumulator.maxPrice, price);
      } else {
        if (accumulator.minPrice === null) accumulator.minPrice = 0;
        return accumulator;
      }
    },
    { maxPrice: 0, minPrice: null }
  );
  if (result.minPrice === null) {
    return { maxPrice: result.maxPrice, minPrice: result.maxPrice };
  }
  return result;

  function minMax(min: number | null, max: number, contender: number) {
    let minPrice = 0;
    if (min === null) {
      minPrice = contender;
    } else {
      minPrice = min > contender ? contender : min;
    }
    const maxPrice = max < contender ? contender : max;
    return { minPrice: formatPrice(minPrice, false), maxPrice: formatPrice(maxPrice, true) };
  }
}
