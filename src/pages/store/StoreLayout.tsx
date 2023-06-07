import { FC, Suspense, createContext, lazy, useEffect, useMemo, useState } from "react";
import { Outlet, useLoaderData, useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { CollectionData, ProductData, getCathegoriesData, getProductsData } from "../../api";
import { StoreDisplayCathegory } from "../../components/Store/CathegoriesFilter";
import { PriceRange } from "../../components/Store/PriceSetter";
import { createLoaderFunction } from "../../utils/createLoaderFunction";
import { CurrenciesMap, formatPrice, getCurrencyRate, getCurrencyRates } from "../../utils/currencyUtils";
import getRouteParams from "../../utils/getRouteParams";
import getSearchParams from "../../utils/getSearchParams";
import { changeSearchParams } from "../../utils/store/changeSearchParams";
import { StoreAsideProps } from "./StoreAside";

const StoreAside = lazy(() => import("./StoreAside"));

interface LoaderData {
  products: CollectionData;
  cathegories: CollectionData;
}
export type ArrayData = { [key: string]: any };
export type FetchedProductData = { data: ProductData; id: string };
type StoreDisplayCathegoriesData = {
  cathegories: StoreDisplayCathegory[];
  allCathegoriesSelector: StoreDisplayCathegory;
};
interface StoreData extends StoreDisplayCathegoriesData {
  products: ArrayData;
}

export const storeLoader = await createLoaderFunction(
  [
    { key: "products", fetcher: getProductsData },
    { key: "cathegories", fetcher: getCathegoriesData },
  ],
  "storeData"
);

// Later on it could be moved for language selection purposes, would have to translate cathegories in database on run.
export const allCathegoriesSelectorName = "all";
export const defaultCurrency = "pln";

export const StoreData = createContext<StoreData>({
  products: {},
  cathegories: [{ cathegoryName: allCathegoriesSelectorName, differentProductsCount: 0 }],
  allCathegoriesSelector: {
    cathegoryName: allCathegoriesSelectorName,
    differentProductsCount: 0,
  },
});

const StoreLayout: FC = function () {
  try {
    const data = useLoaderData() as LoaderData;
    if (!data) throw "Błąd fetcha";
    // search and route params
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchVal, usersMaxPrice, usersMinPrice, selectedCurrency } = getSearchParams(searchParams, [
      "search_val",
      "users_max_price",
      "users_min_price",
      "selected_currency",
    ]);
    const [lastSelectedCurrency, setLastSelectedCurrency] = useState(selectedCurrency);
    const [currencyRates, setCurrencyRates] = useState<CurrenciesMap>(new Map<string, number>());
    const params = useParams();
    const redirect = useNavigate();
    // CurrencyRates and url Setup
    useEffect(() => {
      const rates = getCurrencyRates();
      rates instanceof Promise ? rates.then((data) => setCurrencyRates(data)) : setCurrencyRates(rates);
      if (!Object.hasOwn(searchParams, "selected_currency")) {
        changeSearchParams(
          searchParams,
          ["selected_currency"],
          [localStorage.getItem("selectedCurrency") || defaultCurrency]
        );
        setSearchParams(searchParams);
      }
      if (!Object.hasOwn(params, "current_cathegory")) {
        redirect(`/store/${allCathegoriesSelectorName}?${searchParams}`);
      }
    }, []);
    const { currentCathegory } = getRouteParams(params, ["current_cathegory"], [allCathegoriesSelectorName]);
    // default price range of products in selected cathegory.
    const defaultPriceRange = useMemo(
      () =>
        getPriceRange(
          filterProducts(data.products.collectionData, currencyRates, selectedCurrency, undefined, currentCathegory),
          currencyRates,
          selectedCurrency
        ),
      [currencyRates, selectedCurrency, currentCathegory]
    );
    // updating usersPriceRange on currency data change! One caveat, it's not 1:1 perfect, it works like compression, after many conversions it's polluted (min getting lower, max getting higher)
    useEffect(() => {
      const rating = getCurrencyRate(lastSelectedCurrency, selectedCurrency, currencyRates) || 1;
      setLastSelectedCurrency(selectedCurrency);
      const keys = [];
      const values = [];
      if (usersMaxPrice) {
        keys.push("users_max_price");
        values.push(`${formatPrice(parseFloat(usersMaxPrice) * rating, true)}`);
      }
      if (usersMinPrice) {
        keys.push("users_min_price");
        values.push(`${formatPrice(parseFloat(usersMinPrice) * rating, false)}`);
      }
      if (values.length > 0) {
        changeSearchParams(searchParams, keys, values);
        setSearchParams(searchParams);
      }
    }, [currencyRates, selectedCurrency]);

    const filteredProducts: ArrayData = useMemo(() => {
      const priceRange = {
        maxPrice: parseFloat(usersMaxPrice) || defaultPriceRange.maxPrice,
        minPrice: parseFloat(usersMinPrice) || defaultPriceRange.minPrice,
      };
      return filterProducts(
        data.products.collectionData,
        currencyRates,
        selectedCurrency,
        searchVal,
        currentCathegory,
        priceRange
      );
    }, [searchVal, currentCathegory, usersMaxPrice, usersMinPrice]);

    // for store products context
    const productsMap = useMemo(() => {
      const productsMap = new Map<string, ProductData>();
      data.products.collectionData.forEach((product: FetchedProductData) => {
        productsMap.set(product.id, product.data);
      });
      return productsMap;
    }, []);
    const cathegoriesData = useMemo(
      () => getCathegoriesDataForDisplay(data.cathegories.collectionData, data.products.collectionData),
      [searchVal]
    );
    // clear filters in store aside and in url. Clearing aside works by changing key of storeAside, so i don't have to lift all of this state up there, and keep it local.
    // thanks to this state storeAside rerenders due to other key.
    const [storeAsideSwitch, setStoreAsideSwitch] = useState(true);
    const clearFilters = () => {
      searchParams.delete("search_val");
      searchParams.delete("users_max_price");
      searchParams.delete("users_min_price");
      setSearchParams(searchParams);
      redirect(`/store/${allCathegoriesSelectorName}?${searchParams}`);
      setStoreAsideSwitch((prev) => !prev);
    };

    const StoreAsideProps: StoreAsideProps = {
      filteredProducts,
      currenciesMap: currencyRates,
      defaultPriceRange,
      clearFilters,
    };
    return (
      <>
        <Suspense fallback={<div>Loading...</div>}>
          <StoreData.Provider
            value={{
              products: data.products.collectionData,
              cathegories: cathegoriesData.cathegories,
              allCathegoriesSelector: cathegoriesData.allCathegoriesSelector,
            }}
          >
            <StoreAside key={`store-aside--clear${storeAsideSwitch}`} {...StoreAsideProps}></StoreAside>
          </StoreData.Provider>
        </Suspense>
        <Outlet context={{ productsMap, filteredProducts }} />
      </>
    );
  } catch (error) {
    console.log(error);
    return <div className="store-layout__error">Wystąpił błąd w połączeniu</div>;
  }
};

// HELPER FUNCTIONS

//filters an array of product data based on optional search value, cathegory, and price range arguments.
export function filterProducts(
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

//countProducts, with countProductsPerCathegory and getCathegoriesDataForDisplay
//work together to count the number of products in each category and return an object representing this data for display.
// this one returns object containing cathegoryName and count of different (product can have quantity) products in this cathegory.
function countProducts(
  data: ArrayData,
  cathegoryName: string | false = false,
  searchVal: string = ""
): StoreDisplayCathegory {
  return data.reduce(
    (accumulator: StoreDisplayCathegory, currVal: FetchedProductData) => {
      if (currVal.data.name.toLowerCase().includes(searchVal)) {
        if ((cathegoryName && currVal.data.cathegory.toLowerCase() === cathegoryName.toLowerCase()) || !cathegoryName) {
          return {
            ...accumulator,
            differentProductsCount: accumulator.differentProductsCount + 1,
          };
        }
      }
      return accumulator;
    },
    { cathegoryName, differentProductsCount: 0 }
  );
}
// uses countProducts to return provided cathegories MAPPED, and additionally summary cathegory as sibling object
function countProductsPerCathegory(cathegories: ArrayData, productsData: ArrayData): StoreDisplayCathegoriesData {
  let sumOfAllCathegories = 0;
  const result: StoreDisplayCathegory[] = cathegories.map((cathegoryName: string) => {
    const countedProducts = countProducts(productsData, cathegoryName);
    sumOfAllCathegories += countedProducts.differentProductsCount;
    return countedProducts;
  });
  return {
    cathegories: result,
    allCathegoriesSelector: {
      cathegoryName: allCathegoriesSelectorName,
      differentProductsCount: sumOfAllCathegories,
    },
  };
}
// takes in cathegories data, and merges its NAMES with product counts in ProductData.
function getCathegoriesDataForDisplay(cathegories: ArrayData, productsData: ArrayData): StoreDisplayCathegoriesData {
  let cathegoriesDataCopy: ArrayData[] = JSON.parse(JSON.stringify(cathegories));
  const cathegoriesNames = cathegoriesDataCopy.map((cathegory: any) => {
    return cathegory.data.cathegory;
  });
  return countProductsPerCathegory(cathegoriesNames, productsData);
}

// this function calculates and returns the minimum and maximum prices for a given array of product data, with an optional filter for a specific category.
export function getPriceRange(
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

export default StoreLayout;
