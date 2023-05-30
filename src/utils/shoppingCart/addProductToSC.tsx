import currency from "../currency";

export default function addProductToSC(productData: shoppingCartProductData) {
  const cartData = localStorage.getItem("shoppingCart");
  if (cartData) {
    const prevData = new Map<string, shoppingCartData>(JSON.parse(cartData));
    const currentRecord: shoppingCartData = prevData.get(productData.id) || {
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
export type shoppingCartRecord = [string, shoppingCartData];
export type shoppingCartData = {
  productData: shoppingCartProductData;
  quantity: number;
};
export type shoppingCartProductData = {
  cathegory: string;
  count: number;
  currency: currency;
  discount: boolean;
  discount_price: number;
  id: string;
  name: string;
  photo: string;
  price: number;
};
