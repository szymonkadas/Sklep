import { StoreDisplayCathegory } from "../../components/Store/CathegoriesFilter";
import { ArrayData, FetchedProductData, allCathegoriesSelectorName } from "../../pages/store/StoreLayout";

export type StoreDisplayCathegoriesData = {
  cathegories: StoreDisplayCathegory[];
  allCathegoriesSelector: StoreDisplayCathegory;
};

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
export default function getCathegoriesDataForDisplay(
  cathegories: ArrayData,
  productsData: ArrayData
): StoreDisplayCathegoriesData {
  let cathegoriesDataCopy: ArrayData[] = JSON.parse(JSON.stringify(cathegories));
  const cathegoriesNames = cathegoriesDataCopy.map((cathegory: any) => {
    return cathegory.data.cathegory;
  });
  return countProductsPerCathegory(cathegoriesNames, productsData);
}
