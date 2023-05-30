import { FC, useMemo, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { currencyRatios, getCurrencyRatios } from "../api";
import ProductListing from "../components/ShoppingCart/productListing";
import StatusBar from "../components/StatusBar";
import currency from "../utils/currency";
import currencyUpperCase from "../utils/currencyUpperCase";
import LoaderFunction from "../utils/loaderInterfaces";
import { shoppingCartRecord } from "../utils/shoppingCart/addProductToSC";
import changeSCProductQuantity from "../utils/shoppingCart/changeSCProductQuantity";

export const shoppingCartLoader: LoaderFunction = async ({ params, request }) => {
  //this localstorage is created purely of need to decrease api requests which are limited.
  const storeData = localStorage.getItem("shoppingCart");
  const currencyLSData = localStorage.getItem("currencyData");
  let currencyData;
  if (!currencyLSData) {
    currencyData = await getCurrencyRatios().then((data) => data);
    console.log(currencyData);
    localStorage.setItem("currencyData", JSON.stringify(currencyData));
  }
  return {
    productsData: JSON.parse(storeData || ""),
    currencyData: JSON.parse(currencyLSData || JSON.stringify(currencyData) || ""),
  };
};

const ShoppingCart: FC = () => {
  try {
    const loaderData = useLoaderData() as {
      productsData: shoppingCartRecord[];
      currencyData: currencyRatios;
    };
    const productsMap = useMemo(() => {
      return new Map(loaderData.productsData);
    }, []);

    const baseCurrency = "pln";
    const baseRate = loaderData.currencyData.data[baseCurrency.toUpperCase() as currencyUpperCase].value;
    const [totalPriceInCurrencies, setTotalPriceInCurrencies] = useState({
      usd: 0,
      eur: 0,
      pln: 0,
      gbp: 0,
    } as {
      [key in currency]: number;
    });
    const [totalPrice, setTotalPrice] = useState(totalPriceInCurrencies[baseCurrency]);
    const shipping = useMemo(() => {
      return totalPrice * baseRate > 149.99 * baseRate ? 15.9 * baseRate : 0;
    }, [totalPrice]);
    const [submitButtonsAvailability, setSubmitButtonsAvailability] = useState(true);
    let sbaTimeoutRef: React.MutableRefObject<NodeJS.Timeout | false> = useRef(false);
    const products = useMemo(() => {
      const totalCurrencies = { ...totalPriceInCurrencies };
      const currencies = Object.keys(totalPriceInCurrencies);
      for (let i = 0; i < currencies.length; i++) {
        totalCurrencies[currencies[i] as currency] = 0;
      }
      let basedSum = 0;
      const result = loaderData.productsData.map((product) => {
        const productData = product[1];
        const price = productData.productData.discount
          ? productData.productData.discount_price
          : productData.productData.price;
        totalCurrencies[productData.productData.currency] += price * productData.quantity;
        basedSum +=
          (productData.quantity * (price * baseRate)) /
          loaderData.currencyData.data[productData.productData.currency.toUpperCase() as currencyUpperCase].value;
        return (
          <ProductListing
            key={`shopping-cart__products__list__item${productData.productData.id}`}
            classNamePrefix="shopping-cart__products__list"
            data={productData}
            onQuantityChange={userUpdatingQuantity}
            updateData={updateData}
          />
        );
      });
      setTotalPriceInCurrencies(totalCurrencies);
      setTotalPrice(Math.ceil(basedSum * 100) / 100);
      return result;
    }, []);

    return (
      <article className="shopping-cart--filled">
        <StatusBar
          classNamePrefix="shopping-cart"
          stage={1}
          stageNames={["Koszyk", "Dostawa i płatność", "Gotowe"]}
        ></StatusBar>
        <section className="shopping-cart__products">
          <ul className="shopping-cart__products__list">{...products}</ul>
        </section>
        <section className="shopping-cart__prices">
          <div>
            <div>
              <span>Wartość produktów: </span>
              <span>{totalPrice} </span>
            </div>
            <div>
              <span>Dostawa od </span>
              <span>{shipping}</span>
            </div>
          </div>
          <div>
            <div>
              <span>Razem z dostawą: </span>
              <span>{(totalPrice + shipping).toFixed(2)}</span>
            </div>
            <button disabled={!submitButtonsAvailability}>dostawa i płatność</button>
            <a onClick={() => history.back()}>Kontynuuj Zakupy</a>
          </div>
        </section>
      </article>
    );
    function userUpdatingQuantity() {
      if (sbaTimeoutRef.current) clearTimeout(sbaTimeoutRef.current);
      if (submitButtonsAvailability) setSubmitButtonsAvailability(false);
      sbaTimeoutRef.current = setTimeout(() => {
        setSubmitButtonsAvailability(true);
      }, 1300);
    }
    function updateData(id: string, quantity: number) {
      const data = productsMap.get(id);
      if (data) {
        const price = data.productData.discount ? data.productData.discount_price : data.productData.price;
        const quantityDiff = data.quantity - quantity;
        if (quantity <= data.productData.count) {
          setTotalPriceInCurrencies((prev) => {
            return {
              ...prev,
              [data.productData.currency]: prev[data.productData.currency] - price * quantityDiff,
            };
          });
          setTotalPrice((prev) => {
            return (
              Math.ceil(
                (prev -
                  (price * quantityDiff * baseRate) /
                    loaderData.currencyData.data[data.productData.currency.toUpperCase() as currencyUpperCase].value) *
                  100
              ) / 100
            );
          });
          if (quantity <= 0) {
            productsMap.delete(id);
            changeSCProductQuantity(id, 0);
            products.forEach((element, index) => {
              const key = element.key as string;
              if (key.slice(key.length - id.length, key.length) === id) {
                products.splice(index, 1);
              }
            });
          } else {
            productsMap.set(id, { ...data, quantity });
            changeSCProductQuantity(id, quantity);
          }
        } else {
          productsMap.set(id, { ...data, quantity: data.productData.count });
        }
      } else {
        console.error(
          "Couldn't update data in shopping cart, there is no such element in productsMap with this id:",
          id
        );
      }
    }
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
