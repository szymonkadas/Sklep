import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CurrencyRatios, getCurrencyData } from "../api";
import ShoppingCartMock from "../pages/ShoppingCartMock";
import { sbaContext } from "../pages/ShoppingCartPage";
import { allCathegoriesSelectorName, defaultCurrency } from "../pages/store/StoreLayout";
import "../style/components/css/Header.css";
import { currencySigns } from "../utils/currencyUtils";
import getSearchParams from "../utils/getSearchParams";
import { changeSearchParams } from "../utils/store/changeSearchParams";

type HeaderProps = {
  cathegories: string[];
  shoppingCartData: string;
  setShoppingCartData: React.Dispatch<SetStateAction<string>>;
};
export default function Header(props: HeaderProps) {
  // couldn't use hooks inside inner functions so i'm using native js approach.
  const searchParams = new URLSearchParams(document.location.search);
  const redirect = useNavigate();

  // setting up localStorage currency if not present
  const [currencyData, setCurrencyData] = useState({ meta: { last_updated_at: "" } } as CurrencyRatios);
  useEffect(() => {
    if (!localStorage.getItem("selectedCurrency")) {
      localStorage.setItem("selectedCurrency", defaultCurrency);
    }
    const currencyData = localStorage.getItem("currencyData");
    if (currencyData) {
      setCurrencyData(JSON.parse(currencyData));
    } else {
      getCurrencyData().then((data) => {
        localStorage.setItem("currencyData", JSON.stringify(data));
        setCurrencyData(data);
      });
    }
  }, []);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  useEffect(() => {
    setSelectedCurrency(
      getSearchParams(searchParams, ["selected_currency"]).selectedCurrency ||
        localStorage.getItem("selectedCurrency") ||
        defaultCurrency
    );
  }, [localStorage.getItem("selectedCurrency"), getSearchParams(searchParams, ["selected_currency"]).selectedCurrency]);

  const [submitButtonAvailability, setSubmitButtonAvailability] = useState(true);
  const sbaTimeoutRef: React.MutableRefObject<NodeJS.Timeout | false> = useRef(false);

  // creating elements
  const storeNavLinks = props.cathegories.map((cathegory) => {
    return (
      <NavLink
        to={`/store/${cathegory}?${searchParams}`}
        className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
      >
        {cathegory[0].toUpperCase() + cathegory.slice(1, cathegory.length).toLowerCase()}
      </NavLink>
    );
  });
  const currencyOptions = useMemo(
    () =>
      Array.from(currencySigns).map((currency) => {
        return (
          <option
            key={`header-select-option-${currency[0]}`}
            className="nav-links__li__select-currency__option"
            value={currency[0]}
            onClick={() => {
              localStorage.setItem("selectedCurrency", currency[0]);
              const searchParams = new URLSearchParams(document.location.search);
              const locationPrefix = window.location.pathname;
              changeSearchParams(searchParams, ["selected_currency"], [currency[0]]);
              redirect(`${locationPrefix}?${searchParams}`);
            }}
          >
            {currency[1]}
          </option>
        );
      }),
    []
  );

  return (
    <header className="header">
      <div className="header__logo">Logo</div>
      <nav className="header__nav">
        <ol className="nav__nav-links">
          <li className="nav-links__li">
            <NavLink
              to={`/?${searchParams}`}
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              Strona Główna{" "}
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to={`/store/${allCathegoriesSelectorName}?${searchParams}`}
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              {" "}
              Sklep{" "}
            </NavLink>
            <div className="nav-links__li__sub-cathegories-wrapper">
              <div className="nav-links__li__sub-cathegories">
                <ol className="nav-links__li__sub-cathegories__listed-items">{...storeNavLinks}</ol>
              </div>
            </div>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/account"
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              Konto
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/about"
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              O nas
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/contact"
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              Kontakt
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/shopping_cart"
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              {/* {totalPrice} */}
              <span className="currency"> {currencySigns.get(selectedCurrency)}</span>
            </NavLink>
            {/* Zrób obramowanie, i before'a tak żeby wyglądało to na ikonkę koszyka */}
            <div className="nav-links__li__sub-cathegories-wrapper">
              <div className="nav-links__li__sub-cathegories">
                {/* Zrób by był slider, gridem do ogarnięcia ig i max-heightem*/}
                {currencyData?.meta.last_updated_at ? (
                  <sbaContext.Provider value={{ sbaTimeoutRef, submitButtonAvailability, setSubmitButtonAvailability }}>
                    <ShoppingCartMock
                      shoppingCartData={props.shoppingCartData}
                      setShoppingCartData={props.setShoppingCartData}
                      currencyData={currencyData}
                    >
                      <>
                        <button className="shopping-cart__button--checkout" disabled={!submitButtonAvailability}>
                          dostawa i płatność
                        </button>
                        {/* <a className="shopping-cart__button--continue" onClick={() => history.back()}>
                          Kontynuuj Zakupy
                        </a>{" "} */}
                      </>
                    </ShoppingCartMock>
                  </sbaContext.Provider>
                ) : (
                  "Pusty koszyk"
                )}
                <div className="nav-links__li__sub-cathegories__sum">
                  {/* <b>Kwota:</b> {totalPrice} <span className="currency">{currencySigns.get(selectedCurrency)}</span> */}
                </div>
                <NavLink to="/shopping_cart">
                  <button>Zobacz Koszyk</button>
                </NavLink>
                <NavLink to="/checkout">
                  <button>Zamów</button>
                </NavLink>
              </div>
              {/* LUB BRAK PRODUKTÓW W KOSZYKU */}
            </div>
          </li>
          <li className="nav-links__li">
            <select
              className="nav-links__li__select-currency"
              defaultValue={localStorage.getItem("selectedCurrency") || defaultCurrency}
            >
              {currencyOptions}
            </select>
          </li>
        </ol>
      </nav>
    </header>
  );
}
