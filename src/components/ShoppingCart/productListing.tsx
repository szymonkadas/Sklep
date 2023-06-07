import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCartData } from "../../utils/shoppingCart/addProductToSC";
import Price from "../Store/ProductComponents/Price";

type ProductListingProps = {
  id: string;
  classNamePrefix: string;
  data: ShoppingCartData;
  updateListedProductsData: (id: string, quantity: number) => void;
  onQuantityChange?: () => void;
};

function ProductListing(props: ProductListingProps) {
  const [quantity, setQuantity] = useState(props.data.quantity);
  let quantityTimeoutRef: React.MutableRefObject<NodeJS.Timeout | false> = useRef(false);

  useEffect(() => {
    if (props.onQuantityChange) {
      props.onQuantityChange();
      if (quantity) {
        if (quantityTimeoutRef.current) clearTimeout(quantityTimeoutRef.current);
        quantityTimeoutRef.current = setTimeout(() => {
          props.updateListedProductsData(props.data.productData.id, quantity);
        }, 500);
      }
    }
  }, [quantity]);
  return (
    <li id={props.id} className={`${props.classNamePrefix}__product-item`}>
      <NavLink to={`/store/all/${props.data.productData.id}`}>
        <img
          className={`${props.classNamePrefix}__product-item__img`}
          src={`/src/assets${props.data.productData.photo}`}
        ></img>
      </NavLink>
      <NavLink to={`/store/all/${props.data.productData.id}`}>
        <h5 className={`${props.classNamePrefix}__product-item__name`}>{props.data.productData.name}</h5>
      </NavLink>
      {props.onQuantityChange && (
        <>
          <button
            className={`${props.classNamePrefix}__product-item__button`}
            onClick={() => {
              modifyQuantity(-1, 1, props.data.productData.count, quantity || 2, setQuantity);
            }}
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(event) =>
              modifyQuantity(parseInt(event.target.value), 1, props.data.productData.count, 0, setQuantity)
            }
          ></input>
          <button
            className={`${props.classNamePrefix}__product-item__button`}
            onClick={() => {
              modifyQuantity(1, 1, props.data.productData.count, quantity || 0, setQuantity);
            }}
          >
            +
          </button>
        </>
      )}
      <Price
        classNamePrefix={`${props.classNamePrefix}__product-item`}
        discount={props.data.productData.discount}
        discountPrice={props.data.productData.discount_price}
        price={props.data.productData.price}
        currency={props.data.productData.currency}
      ></Price>
      <button
        className={`${props.classNamePrefix}__product-item__delete-button`}
        onClick={() => {
          props.updateListedProductsData(props.data.productData.id, 0);
        }}
      >
        <i>kosz</i>
      </button>
    </li>
  );
  function modifyQuantity(
    by: number,
    min: number = 1,
    max: number,
    state: number,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) {
    if (state + by > max) {
      setter(max);
    } else if (state + by < min) {
      setter(min);
    } else {
      setter(state + by);
    }
    return;
  }
}

export default ProductListing;
