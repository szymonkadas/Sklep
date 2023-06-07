import { FC } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { ProductData } from "../../api";
import { allCathegoriesSelectorName } from "../../pages/store/StoreLayout";
import { currencySigns } from "../../utils/currencyUtils";
import getRouteParams from "../../utils/getRouteParams";
import addProductToSC from "../../utils/shoppingCart/addProductToSC";
import Price from "./ProductComponents/Price";
import ProductImage from "./ProductComponents/ProductImage";
import ProductRating from "./ProductRating";
interface ProductProps extends ProductData {
  classNamePrefix: string;
  id: string;
}
const ProductTile: FC<ProductProps> = (props) => {
  const { currentCathegory } = getRouteParams(useParams(), ["current_cathegory"], [allCathegoriesSelectorName]);
  const [searchParams, setSearchParams] = useSearchParams();
  if (!currencySigns.get(props.currency)) return <></>;
  return (
    <div className={`${props.classNamePrefix}__product`}>
      {/* ::before'a zrobić przed nim jeśli będzie discount. */}
      <NavLink to={`/store/${currentCathegory}/${props.id}?${searchParams}`}>
        <ProductImage
          classNamePrefix={`${props.classNamePrefix}__product`}
          name={props.name}
          photo={props.photo}
          discount={props.discount}
        />
      </NavLink>
      <div className={`product__data ${props.classNamePrefix}__product__data`}>
        <NavLink
          to={`/store/${currentCathegory}/${props.id}?${searchParams}`}
          className={`product__data__name ${props.classNamePrefix}__product__data__name--navlink`}
        >
          <h6 className={`product__data__name ${props.classNamePrefix}__product__data__name`}>{props.name}</h6>
        </NavLink>
        <p className={`${props.classNamePrefix}__product__data__cathegory`}>{props.cathegory}</p>
        <Price
          classNamePrefix={`${props.classNamePrefix}__product`}
          discount={props.discount}
          discountPrice={props.discount_price}
          price={props.price}
          currency={props.currency}
        />
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
