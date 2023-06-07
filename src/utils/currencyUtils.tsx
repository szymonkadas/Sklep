import { getCurrencyData } from "../api";

//these three are the only maintained currencies.
export type Currency = "usd" | "eur" | "pln" | "gbp";
export type CurrencyUpperCase = "USD" | "EUR" | "PLN" | "GBP";
export const currencySigns = new Map([
  ["pln", "zł"],
  ["eur", "€"],
  ["usd", "$"],
  ["gbp", "£"],
]);

export const getCurrencyRates = () => {
  let currencyData = localStorage.getItem("currencyData");
  if (!currencyData) {
    return getCurrencyData().then((currencyData) => {
      localStorage.setItem("currencyData", JSON.stringify(currencyData));
      return formatCurrencyData(currencyData.data);
    });
  } else {
    return formatCurrencyData(JSON.parse(currencyData).data);
  }
};

export type CurrenciesMap = Map<string, number>;
// WZÓR: EURO = 4.5 ZŁ = 1          z EURO NA ZŁ => ZŁ/EUR         z ZŁ na EURO => EUR/ZŁ
export const getCurrencyRate = (from: string, to: string, map: CurrenciesMap) => {
  const multiplier = map.get(from.toUpperCase());
  const base = map.get(to.toUpperCase());
  if (base && multiplier) {
    return base / multiplier;
  } else {
    return null;
  }
};

function formatCurrencyData(data: {
  [key in CurrencyUpperCase]: { code: string; value: number };
}): Map<string, number> {
  let result = new Map<string, number>();
  for (let [key, value] of Object.entries(data)) {
    result.set(value.code, value.value);
  }
  return result;
}

export function formatPrice(price: number | string, ceil: boolean) {
  const formattedPrice = typeof price === "string" ? parseFloat(price) : price;
  return ceil ? Math.ceil(formattedPrice * 100) / 100 : Math.floor(formattedPrice * 100) / 100;
}
