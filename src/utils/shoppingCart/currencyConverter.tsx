export default function currencyConverter(currency: string) {
  switch (currency) {
    case "pln":
      return "zł";
    case "eur":
      return "€";
    case "usd":
      return "$";
    case "gbp":
      return "£";
    default:
      return currency;
  }
}
