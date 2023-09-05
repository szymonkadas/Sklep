import { FC, createContext, useRef, useState } from "react";
import { useLoaderData, useOutletContext } from "react-router";
import { CurrencyRatios, getCurrencyData } from "../api";
import ShoppingCartPrices from "../components/ShoppingCart/ShoppingCartPrices";
import StatusBar from "../components/StatusBar";
import { Currency } from "../utils/currencyUtils";
import LoaderFunction from "../utils/loaderInterfaces";
import ShoppingCartMock from "./ShoppingCartMock";
import { StoreLayoutContext } from "./store/StoreLayout";

export const shoppingCartLoader: LoaderFunction = async ({ params, request }) => {
  //this localstorage is created purely of need to decrease api requests which are limited.
  const currencyLSData = localStorage.getItem("currencyData");
  let currencyData;
  if (!currencyLSData) {
    currencyData = await getCurrencyData();
    localStorage.setItem("currencyData", JSON.stringify(currencyData));
  }
  return {
    currencyData: JSON.parse(currencyLSData || JSON.stringify(currencyData) || ""),
  };
};

export type TotalPriceInCurrencies = { [key in Currency]: number };

export const sbaContext = createContext({} as any);

const ShoppingCartPage: FC = () => {
  try {
    const { currencyData } = useLoaderData() as {
      currencyData: CurrencyRatios;
    };
    const { shoppingCartData, setShoppingCartData } = useOutletContext() as StoreLayoutContext;

    if (JSON.parse(shoppingCartData).length < 1) {
      throw new Error("Pusty koszyk");
    }

    const [submitButtonAvailability, setSubmitButtonAvailability] = useState(true);
    const sbaTimeoutRef: React.MutableRefObject<NodeJS.Timeout | false> = useRef(false);
    return (
      <article className="shopping-cart-page">
        <StatusBar
          classNamePrefix="shopping-cart-page"
          stage={1}
          stageNames={["Koszyk", "Dostawa i płatność", "Gotowe"]}
        ></StatusBar>
        <sbaContext.Provider value={{ sbaTimeoutRef, submitButtonAvailability, setSubmitButtonAvailability }}>
          <ShoppingCartMock
            shoppingCartData={shoppingCartData}
            setShoppingCartData={setShoppingCartData}
            currencyData={currencyData}
          >
            {/* @ts-ignore  since it will get its neccessary props in mock.*/}
            <ShoppingCartPrices classNamePrefix="shopping-cart--page">
              <button className="shopping-cart--page__button--checkout" disabled={!submitButtonAvailability}>
                dostawa i płatność
              </button>
              {/* button? */}
              <a className="shopping-cart--page__button--continue" onClick={() => history.back()}>
                Kontynuuj Zakupy
              </a>
            </ShoppingCartPrices>
          </ShoppingCartMock>
        </sbaContext.Provider>
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
          <img className="shopping-cart--unfilled__image-container__image" src="" alt="ni ma nic tu"></img>
        </figure>
      </article>
    );
  }
};
export default ShoppingCartPage;
