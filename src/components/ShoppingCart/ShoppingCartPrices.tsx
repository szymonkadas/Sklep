import { FC, PropsWithChildren } from "react";
import { TotalPriceInCurrencies } from "../../pages/ShoppingCartPage";
import { currencySigns, formatPrice } from "../../utils/currencyUtils";

interface ShoppingCartPricesProps extends PropsWithChildren {
  classNamePrefix: string;
  totalPrice: number;
  totalPriceInCurrencies: TotalPriceInCurrencies;
  selectedCurrency: string;
  baseRate: number;
  defaultRate: number;
}

const ShoppingCartPrices: FC<ShoppingCartPricesProps> = (props: ShoppingCartPricesProps) => {
  const currencyDistribution = Object.entries(props.totalPriceInCurrencies)
    .filter(([currency, currencyVolume]) => currencyVolume > 0)
    .map(([currency, currencyVolume]) => {
      return (
        <li
          key={`cart-total-currency-distribution-${currency}-value`}
          className={`cart-summary__prices__values__currencies__list__item ${props.classNamePrefix}__prices__prices__currencies__list__item`}
        >
          {currencyVolume} {currencySigns.get(currency)}
        </li>
      );
    });
  const selectedCurrencySign = currencySigns.get(props.selectedCurrency);
  const shipping =
    props.totalPrice > (149.99 * props.baseRate) / props.defaultRate
      ? 0
      : formatPrice((15.9 * props.baseRate) / props.defaultRate, true);
  return (
    <section className={`cart-summary ${props.classNamePrefix}__cart-summary`}>
      <div className={`cart-summary__prices ${props.classNamePrefix}__cart-summary__prices`}>
        <div className={`cart-summary__prices__values ${props.classNamePrefix}__cart-summary__prices__values`}>
          <span className={`cart-summary__prices__values__desc ${props.classNamePrefix}__cart-summary__prices__desc`}>
            Wartość produktów:&nbsp;
          </span>
          <span className={`cart-summary__prices__values__val ${props.classNamePrefix}__cart-summary__prices__val`}>
            {props.totalPrice} {selectedCurrencySign}
          </span>
          {currencyDistribution.length > 1 && (
            <div
              className={`cart-summary__prices__values__currencies ${props.classNamePrefix}__cart-summary__prices__currencies`}
            >
              <p
                className={`cart-summary__prices__values__currencies__desc ${props.classNamePrefix}__cart-summary__prices__currencies__desc`}
              >
                W tym:
              </p>
              <ul
                className={`cart-summary__prices__values__currencies__list ${props.classNamePrefix}__cart-summary__prices__currencies__list`}
              >
                {currencyDistribution}
              </ul>
            </div>
          )}
        </div>
        <div className={`cart-summary__prices__shipping ${props.classNamePrefix}__cart-summary__prices__shipping`}>
          <span
            className={`cart-summary__prices__shipping__desc ${props.classNamePrefix}__cart-summary__prices__shipping__desc`}
          >
            Dostawa od{" "}
          </span>
          <span
            className={`cart-summary__prices__shipping__val ${props.classNamePrefix}__cart-summary__prices__shipping__val`}
          >
            {shipping} {selectedCurrencySign}
          </span>
        </div>
      </div>
      <div className={`cart-summary__checkout ${props.classNamePrefix}__cart-summary__checkout`}>
        <div className={`cart-summary__checkout__total ${props.classNamePrefix}__cart-summary__checkout__total`}>
          <span
            className={`cart-summary__checkout__total__desc ${props.classNamePrefix}__cart-summary__checkout__total__desc`}
          >
            Razem z dostawą:{" "}
          </span>
          <span
            className={`cart-summary__checkout__total__val ${props.classNamePrefix}__cart-summary__checkout__total__val`}
          >
            {(props.totalPrice + shipping).toFixed(2)} {selectedCurrencySign}{" "}
          </span>
        </div>
        {props.children}
      </div>
    </section>
  );
};

export default ShoppingCartPrices;
