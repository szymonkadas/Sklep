import { useMemo } from "react";
import { CurrencyRatios } from "../../api";
import { ShoppingCartRecord } from "../../utils/shoppingCart/addProductToSC";
import SCProductListing from "./SCProductListing";

type SCProductListProps = {
  classNamePrefix: string;
  productsData: ShoppingCartRecord[];
  currencyData: CurrencyRatios;
  setShoppingCartData: React.Dispatch<React.SetStateAction<string>>;
  onQuantityChange?: () => void;
};

export default function SCProductList(props: SCProductListProps) {
  const productsMap = new Map(props.productsData);
  const products = useMemo(() => {
    return props.productsData.map((product) => {
      const productData = product[1];
      return (
        <SCProductListing
          key={`${props.classNamePrefix}__list__item${productData.productData.id}`}
          id={`${props.classNamePrefix}__list__item${productData.productData.id}`}
          classNamePrefix={`${props.classNamePrefix}__list`}
          data={productData}
          setShoppingCartData={props.setShoppingCartData}
          updateListedProductsData={updateListedProductsData}
          onQuantityChange={props.onQuantityChange}
        />
      );
    });
  }, [props.productsData]);
  return (
    <section className={`${props.classNamePrefix}`}>
      <ul className={`${props.classNamePrefix}__list`}>{...products}</ul>
    </section>
  );

  //Helper Function:
  function updateListedProductsData(id: string, quantity: number) {
    const data = productsMap.get(id);
    if (data) {
      if (quantity <= data.productData.count) {
        if (quantity <= 0) {
          productsMap.delete(id);
        } else {
          productsMap.set(id, { ...data, quantity });
        }
      } else {
        productsMap.set(id, { ...data, quantity: data.productData.count });
      }
      props.setShoppingCartData(JSON.stringify(Array.from(productsMap)));
    } else {
      console.error("Couldn't update data in shopping cart, there is no such element in productsMap with this id:", id);
    }
  }
}
