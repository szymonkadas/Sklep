import { FC } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { productData } from "../../api";
import { allCathegoriesSelectorName } from "../../pages/store/StoreLayout";
import getRouteParams from "../../utils/getRouteParams";
import addProductToSC from "../../utils/shoppingCart/addProductToSC";
import currencyConverter from "../../utils/shoppingCart/currencyConverter";
import ProductRating from "./ProductRating";
interface ProductProps extends productData {
  classNamePrefix: string;
  id: string;
}
const ProductTile: FC<ProductProps> = (props) => {
  const currency: string = currencyConverter(props.currency);
  const { currentCathegory } = getRouteParams(useParams(), ["currentCathegory"], [allCathegoriesSelectorName]);
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className={`${props.classNamePrefix}__product`}>
      {/* ::before'a zrobić przed nim jeśli będzie discount. */}
      <NavLink to={`/store/${currentCathegory}/${props.id}?${searchParams}`}>
        <img
          src={`/src/assets/${props.photo}`}
          alt={`${props.name}-image`}
          className={`${props.classNamePrefix}__product__image${
            props.discount ? "--discount-active" : "--discount-inactive"
          }`}
          width="200px"
        ></img>
      </NavLink>
      <div className={`product__data ${props.classNamePrefix}__product__data`}>
        <NavLink
          to={`/store/${currentCathegory}/${props.id}?${searchParams}`}
          className={`product__data__name ${props.classNamePrefix}__product__data__name--navlink`}
        >
          <h6 className={`product__data__name ${props.classNamePrefix}__product__data__name`}>{props.name}</h6>
        </NavLink>
        <p className={`${props.classNamePrefix}__product__data__cathegory`}>{props.cathegory}</p>
        <p className={`product__data__price ${props.classNamePrefix}__product__data__price`}>
          <span
            className={`product__data__price__regular${props.discount && "--inactive"}${
              props.classNamePrefix
            }__product__data__price__regular${props.discount && "--inactive"}`}
          >
            {props.price}
            &nbsp;
            <span className={`product__data__currency ${props.classNamePrefix}__product__data__price__currency`}>
              {currency}
            </span>
          </span>
          {props.discount && (
            <span className={`product__data__price__discount ${props.classNamePrefix}__product__data__price__discount`}>
              {props.discount_price}
              &nbsp;
              <span
                className={`product__data__price__currency ${props.classNamePrefix}__product__data__price__currency`}
              >
                {currency}
              </span>
              &nbsp;
            </span>
          )}
        </p>
        <ProductRating
          classNamePrefix={`${props.classNamePrefix}__product__data`}
          ratingPath={props.rating}
        ></ProductRating>
      </div>
      <button
        className={`${props.classNamePrefix}__product__add-product-button`}
        onClick={() =>
          addProductToSC({
            cathegory: props.cathegory,
            count: props.count,
            currency: props.currency,
            discount: props.discount,
            discount_price: props.discount_price,
            id: props.id,
            name: props.name,
            photo: props.photo,
            price: props.price,
          })
        }
      >
        Dodaj do koszyka
      </button>
    </div>
  );
};
export default ProductTile;
