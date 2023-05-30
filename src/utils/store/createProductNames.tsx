import { arrayData, fetchedProductData } from "../../pages/store/StoreLayout";
export default function createProductNames(data: arrayData) {
  return data.map((product: fetchedProductData) => {
    return product.data.name;
  });
}
