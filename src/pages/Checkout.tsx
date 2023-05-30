import { FC } from "react";
import { useLoaderData, useParams } from "react-router";
import getRouteParams from "../utils/getRouteParams";
import LoaderFunction from "../utils/loaderInterfaces";

export const checkoutLoader: LoaderFunction = async ({ params, request }) => {
  //this localstorage is created purely of need to decrease api requests which are limited.
  const storeData = localStorage.getItem("shoppingCart");
  if (storeData) {
    return JSON.parse(storeData);
  } else {
    return null;
  }
};
// CheckForTransactions
// WAŻNE! DODAJ PÓŹNIEJ FUNKCJĘ API DO SPRAWDZANIA CZY TAKA TRANSAKCJA JEST JUŻ W BAZIE DANYCH!, TO SAMO PRZY GENEROWANIU ID W LINKACH DO CHECKOUTU! To uniemożliwi podszywanie się po wpisaniu w URL id transakcji.
const Checkout: FC = () => {
  try {
    const products = useLoaderData();
    const params = useParams();
    const transactionId = getRouteParams(params, ["transactionId"], [""]);
    console.log(products);
    if (products && transactionId) {
      return <article className="checkout--filled"> </article>;
    } else {
      // to samo jest w catchu Shopping Cart, może komponent?
      return (
        <article className="checkout--unfilled">
          <section className="checkout--unfilled__text">
            <h1 className="checkout--unfilled__">Transakcja nie udana</h1>
            <p className="checkout--unfilled__">
              {`${
                transactionId ? "Dodaj do koszyka przedmioty i wtedy wróć tutaj" : "Ups, coś poszło nie tak. Zawróć"
              }`}
              .
            </p>
          </section>
          <figure className="checkout--unfilled__image-container">
            <img
              className="checkout--unfilled__image-container__image"
              src="https://a.allegroimg.com/original/128979/cffc85574887bd8fa916acaabaf8"
              alt="ni ma nic tu"
            ></img>
          </figure>
        </article>
      );
    }
  } catch (error) {
    return (
      <article className="checkout--unfilled">
        <section className="checkout--unfilled__text">
          <h1 className="checkout--unfilled__">Transakcja nie udana</h1>
          <p className="checkout--unfilled__">{`Ups, coś poszło nie tak. Zawróć`}.</p>
        </section>
        <figure className="checkout--unfilled__image-container">
          <img
            className="checkout--unfilled__image-container__image"
            src="https://a.allegroimg.com/original/128979/cffc85574887bd8fa916acaabaf8"
            alt="ni ma nic tu"
          ></img>
        </figure>
      </article>
    );
  }
};

export default Checkout;
