import { ArrayData, FetchedProductData } from "../../pages/store/StoreLayout";
export default function createProductNames(data: ArrayData) {
  return data.map((product: FetchedProductData) => {
    return product.data.name;
  });
}
