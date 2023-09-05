import {
  Children,
  FC,
  PropsWithChildren,
  SetStateAction,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { CurrencyRatios } from "../api";
import SCProductList from "../components/ShoppingCart/SCProductList";
import ShoppingCartPrices from "../components/ShoppingCart/ShoppingCartPrices";
import { Currency, CurrencyUpperCase, formatPrice } from "../utils/currencyUtils";
import getSearchParams from "../utils/getSearchParams";
import { ShoppingCartRecord } from "../utils/shoppingCart/addProductToSC";
import calcTotalPrice from "../utils/shoppingCart/calcTotalPrice";
import scButtonsInteractivity from "../utils/shoppingCart/scButtonsInteractivity";
import { TotalPriceInCurrencies, sbaContext } from "./ShoppingCartPage";
import { defaultCurrency } from "./store/StoreLayout";

interface ShoppingCartProps extends PropsWithChildren {
  currencyData: CurrencyRatios;
  shoppingCartData: string;
  setShoppingCartData: React.Dispatch<SetStateAction<string>>;
}

const ShoppingCartMock: FC<ShoppingCartProps> = (props: ShoppingCartProps) => {
  const { sbaTimeoutRef, submitButtonAvailability, setSubmitButtonAvailability } = useContext(sbaContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCurrency, setSelectedCurrency] = useState(
    getSearchParams(searchParams, ["selected_currency"]).selectedCurrency ||
      localStorage.getItem("selectedCurrency") ||
      ""
  );
  useEffect(() => {
    const { url } = getSearchParams(searchParams, ["selected_currency"]);
    const storage = localStorage.getItem("selectedCurrency");
    if (url) {
      setSelectedCurrency(url);
    } else if (storage) {
      setSelectedCurrency(storage);
    } else {
      throw new Error("Such currency isn't usable");
    }
  }, [getSearchParams(searchParams, ["selected_currency"])]);

  const totalPriceInCurrencies = JSON.parse(props.shoppingCartData).reduce(
    (accum: TotalPriceInCurrencies, item: ShoppingCartRecord) => {
      const itemData = item[1];
      const price = itemData.productData.discount ? itemData.productData.discount_price : itemData.productData.price;
      const currency: Currency = itemData.productData.currency;
      accum[currency]
        ? (accum[currency] += formatPrice(price * itemData.quantity, true))
        : (accum[currency] = formatPrice(price * itemData.quantity, true));
      return accum;
    },
    { eur: 0, pln: 0, usd: 0, gbp: 0 }
  );
  const baseRate = props.currencyData.data[selectedCurrency.toUpperCase() as CurrencyUpperCase].value;
  const defaultRate = props.currencyData.data[defaultCurrency.toUpperCase() as CurrencyUpperCase].value;
  const totalPrice = calcTotalPrice(totalPriceInCurrencies, baseRate, props.currencyData);

  return (
    <>
      <SCProductList
        {...{
          classNamePrefix: "shopping-cart__products",
          productsData: JSON.parse(props.shoppingCartData),
          currencyData: props.currencyData,
          onQuantityChange: () =>
            scButtonsInteractivity(sbaTimeoutRef, submitButtonAvailability, setSubmitButtonAvailability),
          setShoppingCartData: props.setShoppingCartData,
        }}
      ></SCProductList>
      {props.children ? (
        Children.map(props.children, (child) => {
          if (isValidElement(child)) {
            if (child.type === ShoppingCartPrices) {
              return cloneElement(child, {
                ...{
                  classNamePrefix: child.props.classNamePrefix || "",
                  baseRate,
                  totalPrice,
                  totalPriceInCurrencies,
                  defaultRate,
                  selectedCurrency,
                },
              });
            } else {
              return child;
            }
          } else {
            return child;
          }
        })
      ) : (
        <></>
      )}
    </>
  );
};

export default ShoppingCartMock;
