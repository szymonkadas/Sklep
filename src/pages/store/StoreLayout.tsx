import { FC, Suspense, createContext, lazy, useEffect, useMemo, useState } from "react";
import { Outlet, useLoaderData, useNavigate, useOutletContext, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { CollectionData, ProductData, getCathegoriesData, getProductsData } from "../../api";
import { LayoutOutletContext, ShoppingCartState } from "../../components/Layout";
import { createLoaderFunction } from "../../utils/createLoaderFunction";
import { CurrenciesMap, formatPrice, getCurrencyRate, getCurrencyRates } from "../../utils/currencyUtils";
import getRouteParams from "../../utils/getRouteParams";
import getSearchParams from "../../utils/getSearchParams";
import { changeSearchParams } from "../../utils/store/changeSearchParams";
import filterProducts from "../../utils/store/filterProducts";
import getCathegoriesDataForDisplay, {
  StoreDisplayCathegoriesData,
} from "../../utils/store/getCathegoriesDataForDisplay";
import getPriceRange from "../../utils/store/getPriceRange";
import { StoreAsideProps } from "./StoreAside";

const StoreAside = lazy(() => import("./StoreAside"));

interface LoaderData {
  products: CollectionData;
  cathegories: CollectionData;
}
export type ArrayData = { [key: string]: any };
export type FetchedProductData = { data: ProductData; id: string };

export interface StoreData extends StoreDisplayCathegoriesData {
  products: ArrayData;
}
export interface StoreLayoutContext extends ShoppingCartState {
  filteredProducts: ArrayData;
  productsMap: Map<string, ProductData>;
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
    }, []);
    useEffect(() => {
      if (!Object.hasOwn(params, "current_cathegory")) {
        redirect(`/store/${allCathegoriesSelectorName}?${searchParams}`);
      }
    }, [[params]]);
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

    const { setShoppingCartData, shoppingCartData } = useOutletContext() as LayoutOutletContext;
    const outletContext: StoreLayoutContext = {
      productsMap,
      filteredProducts: filteredProducts,
      setShoppingCartData,
      shoppingCartData,
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
        <Outlet context={outletContext} />
      </>
    );
  } catch (error) {
    console.log(error);
    return <div className="store-layout__error">Wystąpił błąd w połączeniu</div>;
  }
};

export default StoreLayout;
