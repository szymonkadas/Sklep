import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CurrenciesMap,
  Currency,
  currencySigns,
  formatPrice,
  getCurrencyRate,
  getCurrencyRates,
} from "../../../utils/currencyUtils";
import getSearchParams from "../../../utils/getSearchParams";

type PriceProps = {
  classNamePrefix: string;
  discount: boolean;
  discountPrice: number;
  price: number;
  currency: Currency;
};
const Price: FC<PriceProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCurrency =
    localStorage.getItem("selectedCurrency") || getSearchParams(searchParams, ["selected_currency"]).selectedCurrency;
  const currencySign = currencySigns.get(selectedCurrency);
  if (!selectedCurrency || !currencySign) return <></>;
  const [currencyRates, setCurrencyRates] = useState<CurrenciesMap>(new Map<string, number>());
  useEffect(() => {
    const rates = getCurrencyRates();
    rates instanceof Promise ? rates.then((data) => setCurrencyRates(data)) : setCurrencyRates(rates);
  }, []);
  const rating = getCurrencyRate(props.currency, selectedCurrency, currencyRates) || 1;
  const currency_exchange_notification = (
    <span
      className={`product__data__price__exchange-notification ${props.classNamePrefix}__data__price__exchange-notification`}
    >
      ({props.discount ? props.discountPrice : props.price} {props.currency})
    </span>
  );
  return (
    <p className={`product__data__price ${props.classNamePrefix}__data__price`}>
      <span
        className={`product__data__price__regular${props.discount && "--inactive"} ${
          props.classNamePrefix
        }__data__price__regular${props.discount && "--inactive"}`}
      >
        {formatPrice(props.price * rating, true)}
        &nbsp;
        <span className={`product__data__currency ${props.classNamePrefix}__data__price__currency`}>
          {currencySign}
        </span>
      </span>
      {props.discount && (
        <span className={`product__data__price__discount ${props.classNamePrefix}__data__price__discount`}>
          {formatPrice(props.discountPrice * rating, true)}
          &nbsp;
          <span className={`product__data__price__currency ${props.classNamePrefix}__data__price__currency`}>
            {currencySign}
          </span>
          &nbsp;
        </span>
      )}
      {/* if selected currency isn't the same as products main currency, then user will be notified visually on the product tile of such occurence */}
      {props.currency !== selectedCurrency && currency_exchange_notification}
    </p>
  );
};

export default Price;
