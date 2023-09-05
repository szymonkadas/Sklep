import { ShoppingCartData } from "./addProductToSC";

// it works on saved data in localStorage, not on actual stated data
export default function changeSCProductQuantity(currentData: string, productId: string, desiredQuantity: number) {
  const cartData = JSON.parse(currentData);
  if (cartData) {
    const mappedData = new Map<string, ShoppingCartData>(cartData);
    const desiredRecord = mappedData.get(productId);
    if (desiredRecord) {
      const quantity =
        desiredRecord.productData.count > desiredQuantity ? desiredQuantity : desiredRecord.productData.count;
      if (quantity > 0) {
        mappedData.set(productId, { productData: desiredRecord.productData, quantity });
      } else {
        mappedData.delete(productId);
      }
      const result = JSON.stringify(Array.from(mappedData));
      localStorage.setItem("shoppingCart", result);
      return result;
    } else {
      console.error("there is no such item");
    }
  } else {
    console.error("Shopping cart doesn't exist!");
  }
}
