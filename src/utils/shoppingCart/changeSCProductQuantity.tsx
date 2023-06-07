import { ShoppingCartData } from "./addProductToSC";
export default function changeSCProductQuantity(productId: string, desiredQuantity: number) {
  const cartData = localStorage.getItem("shoppingCart");
  if (cartData) {
    const mappedData = new Map<string, ShoppingCartData>(JSON.parse(cartData));
    const desiredRecord = mappedData.get(productId);
    if (desiredRecord) {
      const quantity =
        desiredRecord.productData.count > desiredQuantity ? desiredQuantity : desiredRecord.productData.count;
      if (quantity > 0) {
        mappedData.set(productId, { productData: desiredRecord.productData, quantity });
      } else {
        mappedData.delete(productId);
      }
      localStorage.setItem("shoppingCart", JSON.stringify(Array.from(mappedData)));
    } else {
      console.error("there is no such item");
    }
  } else {
    console.error("there aren't any products in the shopping cart!");
  }
}
