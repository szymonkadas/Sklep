import { FC, Suspense, createContext, lazy, useEffect, useMemo, useState } from "react";
import { Outlet, useLoaderData, useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { CollectionData, getCathegoriesData, getProductsData, productData } from "../../api";
import { storeDisplayCathegory } from "../../components/Store/CathegoriesFilter";
import { priceRange } from "../../components/Store/PriceSetter";
import { changeSearchParams } from "../../utils/changeSearchParams";
import { createLoaderFunction } from "../../utils/createLoaderFunction";
import getRouteParam from "../../utils/getRouteParams";
import getSearchParams from "../../utils/getSearchParams";
import { storeAsideProps } from "./StoreAside";
const StoreAside = lazy(() => import("./StoreAside"));

interface LoaderData {
  products: CollectionData;
  cathegories: CollectionData;
}
export type arrayData = { [key: string]: any };
export type fetchedProductData = { data: productData; id: string };
type storeDisplayCathegoriesData = {
  cathegories: storeDisplayCathegory[];
  allCathegoriesSelector: storeDisplayCathegory;
};
interface StoreData extends storeDisplayCathegoriesData {
  products: arrayData;
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
    const { searchVal, usersMaxPrice, usersMinPrice } = getSearchParams(searchParams, [
      "searchVal",
      "usersMaxPrice",
      "usersMinPrice",
    ]);
    const { currentCathegory } = getRouteParam(useParams(), ["currentCathegory"], [allCathegoriesSelectorName]);
    // usersPriceRangeSetup
    const defaultPriceRange: priceRange = getPriceRange(data.products.collectionData);
    useEffect(() => {
      changeSearchParams(
        searchParams,
        ["usersMaxPrice", "usersMinPrice"],
        [defaultPriceRange.maxPrice.toFixed(2), defaultPriceRange.minPrice.toFixed(2)]
      );
      setSearchParams(searchParams);
    }, []);
    const usersPriceRange: priceRange = useMemo(() => {
      return {
        maxPrice: parseFloat(usersMaxPrice),
        minPrice: parseFloat(usersMinPrice),
      };
    }, [usersMaxPrice, usersMinPrice]);

    const filteredProducts: arrayData = useMemo(
      () => filterProducts(data.products.collectionData, searchVal, currentCathegory, usersPriceRange),
      [searchVal, currentCathegory, usersMaxPrice, usersMinPrice]
    );
    // for store products context
    const productsMap = useMemo(() => {
      const productsMap = new Map<string, productData>();
      filteredProducts.forEach((product: fetchedProductData) => {
        productsMap.set(product.id, product.data);
      });
      return productsMap;
    }, []);
    const cathegoriesData = useMemo(
      () => getCathegoriesDataForDisplay(data.cathegories.collectionData, data.products.collectionData),
      [searchVal]
    );
    // clear filters in store aside and in url. Clearing aside works by changing key of storeAside, so i don't have to lift all of this state up there, and keep it local.
    const [storeAsideSwitch, setStoreAsideSwitch] = useState(true);
    const clearCathegory = useNavigate();
    const clearFilters = () => {
      changeSearchParams(
        searchParams,
        ["searchVal", "usersMinPrice", "usersMaxPrice"],
        ["", defaultPriceRange.minPrice.toFixed(2), defaultPriceRange.maxPrice.toFixed(2)]
      );
      setSearchParams(searchParams);
      clearCathegory(`/store/${allCathegoriesSelectorName}?${searchParams}`);
      setStoreAsideSwitch((prev) => !prev);
    };

    const StoreAsideProps: storeAsideProps = {
      filteredProducts,
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

//filters an array of product data based on optional search value, cathegory, and price range arguments.
export function filterProducts(
  data: arrayData,
  searchVal?: string,
  cathegory?: string,
  priceRange?: priceRange
): arrayData {
  let result = JSON.parse(JSON.stringify(data));
  if (searchVal !== undefined) {
    result = result.filter((product: fetchedProductData) => {
      return product.data.name.toLowerCase().includes(searchVal.toLowerCase().trim());
    });
  }
  if (cathegory !== undefined && cathegory.length > 0 && cathegory !== allCathegoriesSelectorName) {
    result = result.filter((product: fetchedProductData) => product.data.cathegory === cathegory);
  }
  if (priceRange !== undefined) {
    result = result.filter((product: fetchedProductData) => {
      if (product.data.discount && product.data.discount_price) {
        if (product.data.discount_price >= priceRange.minPrice && product.data.discount_price <= priceRange.maxPrice) {
          return product;
        }
      } else if (product.data.price) {
        if (product.data.price >= priceRange.minPrice && product.data.price <= priceRange.maxPrice) {
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
  data: arrayData,
  cathegoryName: string | false = false,
  searchVal: string = ""
): storeDisplayCathegory {
  return data.reduce(
    (accumulator: storeDisplayCathegory, currVal: fetchedProductData) => {
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
function countProductsPerCathegory(cathegories: arrayData, productsData: arrayData): storeDisplayCathegoriesData {
  let sumOfAllCathegories = 0;
  const result: storeDisplayCathegory[] = cathegories.map((cathegoryName: string) => {
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
// takes in cathegories data, and merges its NAMES with product counts in productData.
function getCathegoriesDataForDisplay(cathegories: arrayData, productsData: arrayData): storeDisplayCathegoriesData {
  let cathegoriesDataCopy: arrayData[] = JSON.parse(JSON.stringify(cathegories));
  const cathegoriesNames = cathegoriesDataCopy.map((cathegory: any) => {
    return cathegory.data.cathegory;
  });
  return countProductsPerCathegory(cathegoriesNames, productsData);
}

// this function calculates and returns the minimum and maximum prices for a given array of product data, with an optional filter for a specific category.
export function getPriceRange(productsData: arrayData, cathegory: string | false = false): priceRange {
  let dataCopy = JSON.parse(JSON.stringify(productsData));
  const result = dataCopy.reduce(
    (accumulator: priceRange, currVal: fetchedProductData) => {
      if (cathegory && currVal.data.cathegory !== cathegory) return accumulator;
      if (currVal.data.discount && currVal.data.discount_price) {
        if (accumulator.minPrice === null) accumulator.minPrice = currVal.data.discount_price;
        const minPrice =
          accumulator.minPrice > currVal.data.discount_price ? currVal.data.discount_price : accumulator.minPrice;
        const maxPrice =
          accumulator.maxPrice < currVal.data.discount_price ? currVal.data.discount_price : accumulator.maxPrice;
        return { minPrice, maxPrice };
      } else if (currVal.data.price) {
        if (accumulator.minPrice === null) accumulator.minPrice = currVal.data.price;
        const minPrice = accumulator.minPrice > currVal.data.price ? currVal.data.price : accumulator.minPrice;
        const maxPrice = accumulator.maxPrice < currVal.data.price ? currVal.data.price : accumulator.maxPrice;
        return { minPrice, maxPrice };
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
}

export default StoreLayout;
