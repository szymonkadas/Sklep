import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CurrencyRatios, getCurrencyData } from "../api";
import { TotalPriceInCurrencies } from "../pages/ShoppingCart";
import { allCathegoriesSelectorName, defaultCurrency } from "../pages/store/StoreLayout";
import "../style/components/css/Header.css";
import { CurrencyUpperCase, currencySigns } from "../utils/currencyUtils";
import getSearchParams from "../utils/getSearchParams";
import calcTotalPrice from "../utils/shoppingCart/calcTotalPrice";
import { changeSearchParams } from "../utils/store/changeSearchParams";
import ProductList from "./ShoppingCart/ProductsList";

type HeaderProps = {
  cathegories: string[];
};
export default function Header(props: HeaderProps) {
  // couldn't use hooks inside inner functions so i'm using native js approach.
  const searchParams = new URLSearchParams(document.location.search);
  const redirect = useNavigate();
  // setting up localStorage currency if not present
  useEffect(() => {
    if (!localStorage.getItem("selectedCurrency")) {
      localStorage.setItem("selectedCurrency", defaultCurrency);
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
  const [totalPriceInCurrencies, setTotalPriceInCurrencies] = useState({
    usd: 0,
    eur: 0,
    pln: 0,
    gbp: 0,
  } as TotalPriceInCurrencies);

  const [productsData, setProductsData] = useState(JSON.parse(localStorage.getItem("shoppingCart") || ""));
  useEffect(() => {
    setProductsData(JSON.parse(localStorage.getItem("shoppingCart") || ""));
  }, [localStorage.getItem("shoppingCart")]);

  const [currencyData, setCurrencyData] = useState({ meta: { last_updated_at: "" } } as CurrencyRatios);
  useEffect(() => {
    const currencyData = localStorage.getItem("currencyData");
    if (currencyData) {
      setCurrencyData(JSON.parse(currencyData));
    } else {
      getCurrencyData().then((data) => {
        localStorage.setItem("currencyData", data);
      });
    }
  }, [localStorage.getItem("currencyData")]);

  const totalPrice = useMemo(() => {
    const baseRate = Object.hasOwn(currencyData, "data")
      ? currencyData.data[selectedCurrency.toUpperCase() as CurrencyUpperCase].value
      : 1;
    return Object.hasOwn(currencyData, "data") ? calcTotalPrice(totalPriceInCurrencies, baseRate, currencyData) : 0;
  }, [totalPriceInCurrencies, selectedCurrency]);

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
              {totalPrice}
              <span className="currency"> {currencySigns.get(selectedCurrency)}</span>
            </NavLink>
            {/* Zrób obramowanie, i before'a tak żeby wyglądało to na ikonkę koszyka */}
            <div className="nav-links__li__sub-cathegories-wrapper">
              <div className="nav-links__li__sub-cathegories">
                {/* Zrób by był slider, gridem do ogarnięcia ig i max-heightem*/}
                {productsData && currencyData.meta.last_updated_at && (
                  <ProductList
                    classNamePrefix="nav-links__li__sub-cathegories__products"
                    totalPriceInCurrencies={totalPriceInCurrencies}
                    setTotalPriceInCurrencies={setTotalPriceInCurrencies}
                    productsData={productsData}
                    currencyData={currencyData}
                  ></ProductList>
                )}
                <div className="nav-links__li__sub-cathegories__sum">
                  <b>Kwota:</b> {totalPrice} <span className="currency">{currencySigns.get(selectedCurrency)}</span>
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
