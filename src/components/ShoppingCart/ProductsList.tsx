import { useEffect, useMemo, useState } from "react";
import { CurrencyRatios } from "../../api";
import { TotalPriceInCurrencies } from "../../pages/ShoppingCart";
import { Currency, formatPrice } from "../../utils/currencyUtils";
import { ShoppingCartRecord } from "../../utils/shoppingCart/addProductToSC";
import changeSCProductQuantity from "../../utils/shoppingCart/changeSCProductQuantity";
import ProductListing from "./ProductListing";

type ProductListProps = {
  classNamePrefix: string;
  totalPriceInCurrencies: TotalPriceInCurrencies;
  productsData: ShoppingCartRecord[];
  currencyData: CurrencyRatios;
  setTotalPriceInCurrencies: (value: React.SetStateAction<TotalPriceInCurrencies>) => void;
  onQuantityChange?: () => void;
};

export default function ProductList(props: ProductListProps) {
  const productsMap = useMemo(() => {
    return new Map(props.productsData);
  }, []);
  const [products, setProducts] = useState<JSX.Element[]>([<></>]);
  useEffect(() => {
    if (props.productsData) {
      const totalCurrencies = { ...props.totalPriceInCurrencies };
      const currencies = Object.keys(props.totalPriceInCurrencies);
      for (let i = 0; i < currencies.length; i++) {
        totalCurrencies[currencies[i] as Currency] = 0;
      }
      const result = props.productsData.map((product) => {
        const productData = product[1];
        const price = productData.productData.discount
          ? productData.productData.discount_price
          : productData.productData.price;
        totalCurrencies[productData.productData.currency] += formatPrice(price * productData.quantity, true);
        return (
          <ProductListing
            key={`${props.classNamePrefix}__list__item${productData.productData.id}`}
            id={`${props.classNamePrefix}__list__item${productData.productData.id}`}
            classNamePrefix={`${props.classNamePrefix}__list`}
            data={productData}
            updateListedProductsData={updateListedProductsData}
            onQuantityChange={props.onQuantityChange}
          />
        );
      });
      props.setTotalPriceInCurrencies(totalCurrencies);
      setProducts(result);
    }
  }, []);
  return (
    <section className={`${props.classNamePrefix}`}>
      <ul className={`${props.classNamePrefix}__list`}>{...products}</ul>
    </section>
  );

  //Helper Function:
  function updateListedProductsData(id: string, quantity: number) {
    const data = productsMap.get(id);
    if (data) {
      const price = data.productData.discount ? data.productData.discount_price : data.productData.price;
      const quantityDiff = data.quantity - quantity;
      if (quantity <= data.productData.count) {
        props.setTotalPriceInCurrencies((prev) => {
          return {
            ...prev,
            [data.productData.currency]: formatPrice(prev[data.productData.currency] - price * quantityDiff, true),
          };
        });
        if (quantity <= 0) {
          productsMap.delete(id);
          changeSCProductQuantity(id, 0);
          setProducts((products) =>
            products.filter((product) => {
              if (product.props.id.slice(product.props.id.length - id.length) !== id) {
                return product;
              }
            })
          );
        } else {
          productsMap.set(id, { ...data, quantity });
          changeSCProductQuantity(id, quantity);
        }
      } else {
        productsMap.set(id, { ...data, quantity: data.productData.count });
      }
    } else {
      console.error("Couldn't update data in shopping cart, there is no such element in productsMap with this id:", id);
    }
  }
}
