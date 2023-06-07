import { CurrencyRatios } from "../../api";
import { TotalPriceInCurrencies } from "../../pages/ShoppingCart";
import { Currency, CurrencyUpperCase, formatPrice } from "../currencyUtils";

export default function calcTotalPrice(
  totalPriceInCurrencies: TotalPriceInCurrencies,
  baseRate: number,
  currencyData: CurrencyRatios
) {
  let value = 0;
  const currencies = Object.keys(totalPriceInCurrencies) as Currency[];
  currencies.forEach((currency) => {
    value += formatPrice(
      (totalPriceInCurrencies[currency] * baseRate) /
        currencyData.data[currency.toUpperCase() as CurrencyUpperCase].value,
      true
    );
  });
  return formatPrice(value, true);
}
