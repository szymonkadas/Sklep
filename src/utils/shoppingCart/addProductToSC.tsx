import { Currency } from "../currencyUtils";

export default function addProductToSC(productData: ShoppingCartProductData) {
  const cartData = localStorage.getItem("shoppingCart");
  if (cartData) {
    const prevData = new Map<string, ShoppingCartData>(JSON.parse(cartData));
    const currentRecord: ShoppingCartData = prevData.get(productData.id) || {
      productData,
      quantity: 0,
    };
    if (currentRecord.quantity >= productData.count) {
      currentRecord.quantity = productData.count - 1;
    }
    prevData.set(productData.id, { productData: currentRecord.productData, quantity: currentRecord.quantity + 1 });
    localStorage.setItem("shoppingCart", JSON.stringify(Array.from(prevData)));
  } else {
    localStorage.setItem(
      "shoppingCart",
      JSON.stringify(Array.from(new Map([[productData.id, { productData, quantity: 1 }]])))
    );
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
