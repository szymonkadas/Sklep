import { Currency } from "../currencyUtils";
// It works on saved data in local storage, not state of app.
// function takes current shopping cart data, and adds to it desired product, then returns data with added product.
export default function addProductToSC(currentData: string, productData: ShoppingCartProductData) {
  const cartData = JSON.parse(currentData);
  if (cartData.length > 0) {
    const prevData = new Map<string, ShoppingCartData>(cartData);
    const currentRecord: ShoppingCartData = prevData.get(productData.id) || {
      productData,
      quantity: 0,
    };
    if (currentRecord.quantity >= productData.count) {
      currentRecord.quantity = productData.count - 1;
    }
    prevData.set(productData.id, { productData: currentRecord.productData, quantity: currentRecord.quantity + 1 });
    const result = JSON.stringify(Array.from(prevData));
    localStorage.setItem("shoppingCart", result);
    return result;
  } else {
    cartData.push([productData.id, { productData, quantity: 1 }]);
    const result = JSON.stringify(Array.from(cartData));
    localStorage.setItem("shoppingCart", result);
    return result;
  }
}
export type ShoppingCartRecord = [string, ShoppingCartData];
export type ShoppingCartData = {
  productData: ShoppingCartProductData;
  quantity: number;
};
export type ShoppingCartProductData = {
  cathegory: string;
  count: number;
  currency: Currency;
  discount: boolean;
  discount_price: number;
  id: string;
  name: string;
  photo: string;
  price: number;
};
