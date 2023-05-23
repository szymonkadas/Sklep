import { FC } from "react";
import { NavLink } from "react-router-dom";
import { productData } from "../../api";
import ProductRating from "./ProductRating";
interface ProductProps extends productData {
  classNamePrefix: string;
  id: string;
}
const ProductTile: FC<ProductProps> = (props) => {
  const currency: string = currencyConverter(props.currency);
  return (
    <div className={`${props.classNamePrefix}__product`}>
      {/* ::before'a zrobić przed nim jeśli będzie discount. */}
      <NavLink to={props.id}>
        <img
          src={`/src/assets/${props.photo}`}
          alt={`${props.name}-image`}
          className={`${props.classNamePrefix}__product__image${
            props.discount ? "--discount-active" : "--discount-inactive"
          }`}
          width="200px"
        ></img>
      </NavLink>
      <div className={`${props.classNamePrefix}__product__data`}>
        <h6 className={`${props.classNamePrefix}__product__data__name`}>
          {props.name}
        </h6>
        <p className={`${props.classNamePrefix}__product__data__cathegory`}>
          {props.cathegory}
        </p>
        <p className={`${props.classNamePrefix}__product__data__price`}>
          {props.discount && (
            <span
              className={`${props.classNamePrefix}__product__data__price__discount`}
            >
              {props.discount_price}
              &nbsp;
              <span
                className={`${props.classNamePrefix}__product__data__price__currency`}
              >
                {currency}
              </span>
              &nbsp;
            </span>
          )}
          <span className={`${props.classNamePrefix}__product__data__price`}>
            {props.price}
            &nbsp;
            <span
              className={`${props.classNamePrefix}__product__data__price__currency`}
            >
              {currency}
            </span>
          </span>
        </p>
        <ProductRating
          classNamePrefix={`${props.classNamePrefix}__product__data`}
          ratingPath={props.rating}
        ></ProductRating>
      </div>
    </div>
  );
};
export default ProductTile;

export function currencyConverter(currency: string) {
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
