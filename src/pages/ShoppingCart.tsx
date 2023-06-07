import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { useSearchParams } from "react-router-dom";
import { CurrencyRatios, getCurrencyData } from "../api";
import ProductList from "../components/ShoppingCart/ProductsList";
import StatusBar from "../components/StatusBar";
import { Currency, CurrencyUpperCase, currencySigns, formatPrice } from "../utils/currencyUtils";
import getSearchParams from "../utils/getSearchParams";
import LoaderFunction from "../utils/loaderInterfaces";
import { ShoppingCartRecord } from "../utils/shoppingCart/addProductToSC";
import calcTotalPrice from "../utils/shoppingCart/calcTotalPrice";
import userUpdatingQuantity from "../utils/shoppingCart/userUpdatingQuantity";
import { defaultCurrency } from "./store/StoreLayout";

export const shoppingCartLoader: LoaderFunction = async ({ params, request }) => {
  //this localstorage is created purely of need to decrease api requests which are limited.
  const storeData = localStorage.getItem("shoppingCart");
  const currencyLSData = localStorage.getItem("currencyData");
  let currencyData;
  if (!currencyLSData) {
    currencyData = await getCurrencyData();
    localStorage.setItem("currencyData", JSON.stringify(currencyData));
  }
  return {
    productsData: JSON.parse(storeData || ""),
    currencyData: JSON.parse(currencyLSData || JSON.stringify(currencyData) || ""),
  };
};

export type TotalPriceInCurrencies = { [key in Currency]: number };

const ShoppingCart: FC = () => {
  try {
    const loaderData = useLoaderData() as {
      productsData: ShoppingCartRecord[];
      currencyData: CurrencyRatios;
    };
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
    }, [localStorage.getItem("selectedCurrency") || getSearchParams(searchParams, ["selected_currency"])]);
    const [totalPriceInCurrencies, setTotalPriceInCurrencies] = useState({
      usd: 0,
      eur: 0,
      pln: 0,
      gbp: 0,
    } as TotalPriceInCurrencies);

    const baseRate = loaderData.currencyData.data[selectedCurrency.toUpperCase() as CurrencyUpperCase].value;
    const totalPrice = useMemo(
      () => calcTotalPrice(totalPriceInCurrencies, baseRate, loaderData.currencyData),
      [totalPriceInCurrencies, selectedCurrency]
    );
    const defaultRate = loaderData.currencyData.data[defaultCurrency.toUpperCase() as CurrencyUpperCase].value;
    const shipping = useMemo(() => {
      return totalPrice > (149.99 * baseRate) / defaultRate ? 0 : formatPrice((15.9 * baseRate) / defaultRate, true);
    }, [totalPrice]);

    const selectedCurrencySign = currencySigns.get(selectedCurrency);
    const currencyDistribution = useMemo(() => {
      const currencies = Object.keys(totalPriceInCurrencies);
      return currencies
        .filter((currency) => totalPriceInCurrencies[currency as Currency] > 0)
        .map((currency) => {
          const value = totalPriceInCurrencies[currency as Currency];
          return (
            <li key={`shopping-cart-total-currency-distribution-${currency}-value`}>
              {value} {currencySigns.get(currency)}
            </li>
          );
        });
    }, [totalPriceInCurrencies]);

    const [submitButtonAvailability, setSubmitButtonAvailability] = useState(true);
    let sbaTimeoutRef: React.MutableRefObject<NodeJS.Timeout | false> = useRef(false);

    return (
      <article className="shopping-cart--filled">
        <StatusBar
          classNamePrefix="shopping-cart"
          stage={1}
          stageNames={["Koszyk", "Dostawa i płatność", "Gotowe"]}
        ></StatusBar>
        {/* <section className="shopping-cart__products">
          <ul className="shopping-cart__products__list">{...products}</ul>
        </section> */}
        <ProductList
          {...{
            classNamePrefix: "shopping-cart__products",
            totalPriceInCurrencies,
            productsData: loaderData.productsData,
            currencyData: loaderData.currencyData,
            setTotalPriceInCurrencies,
            onQuantityChange: () =>
              userUpdatingQuantity(sbaTimeoutRef, submitButtonAvailability, setSubmitButtonAvailability),
          }}
        ></ProductList>
        <section className="shopping-cart__prices">
          <div>
            <div>
              <span>Wartość produktów: </span>
              <span>
                {totalPrice} {selectedCurrencySign}
              </span>
              {currencyDistribution.length > 1 && (
                <div>
                  <p>W tym:</p>
                  <ul>{currencyDistribution}</ul>
                </div>
              )}
            </div>
            <div>
              <span>Dostawa od </span>
              <span>
                {shipping} {selectedCurrencySign}
              </span>
            </div>
          </div>
          <div>
            <div>
              <span>Razem z dostawą: </span>
              <span>
                {(totalPrice + shipping).toFixed(2)} {selectedCurrencySign}{" "}
              </span>
            </div>
            <button disabled={!submitButtonAvailability}>dostawa i płatność</button>
            <a onClick={() => history.back()}>Kontynuuj Zakupy</a>
          </div>
        </section>
      </article>
    );
  } catch (error) {
    console.log(error);
    return (
      <article className="shopping-cart--unfilled">
        <section className="shopping-cart--unfilled__text">
          <h1 className="shopping-cart--unfilled__">Twój koszyk jest pusty!</h1>
          <p className="shopping-cart--unfilled__">Dodaj do koszyka przedmioty i wtedy wróć tutaj.</p>
        </section>
        <figure className="shopping-cart--unfilled__image-container">
          <img
            className="shopping-cart--unfilled__image-container__image"
            src="https://a.allegroimg.com/original/128979/cffc85574887bd8fa916acaabaf8"
            alt="ni ma nic tu"
          ></img>
        </figure>
      </article>
    );
  }
};

export default ShoppingCart;
