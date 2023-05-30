import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { shoppingCartData } from "../../utils/shoppingCart/addProductToSC";

type productListingProps = {
  classNamePrefix: string;
  data: shoppingCartData;
  onQuantityChange: () => void;
  updateData: (id: string, quantity: number) => void;
};

function ProductListing(props: productListingProps) {
  const [quantity, setQuantity] = useState(props.data.quantity);
  let quantityTimeoutRef: React.MutableRefObject<NodeJS.Timeout | false> = useRef(false);

  useEffect(() => {
    props.onQuantityChange();
    if (quantity) {
      if (quantityTimeoutRef.current) clearTimeout(quantityTimeoutRef.current);
      quantityTimeoutRef.current = setTimeout(() => {
        props.updateData(props.data.productData.id, quantity);
      }, 500);
    }
  }, [quantity]);
  return (
    <li className={`${props.classNamePrefix}__product-item`}>
      <NavLink to={`/store/all/${props.data.productData.id}`}>
        <img
          className={`${props.classNamePrefix}__product-item__img`}
          src={`/src/assets${props.data.productData.photo}`}
        ></img>
      </NavLink>
      <NavLink to={`/store/all/${props.data.productData.id}`}>
        <h5 className={`${props.classNamePrefix}__product-item__name`}>{props.data.productData.name}</h5>
      </NavLink>
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
      <h5 className={`${props.classNamePrefix}__product-item__price`}>
        {props.data.productData.discount ? props.data.productData.discount_price : props.data.productData.price}
      </h5>
      <button
        className={`${props.classNamePrefix}__product-item__delete-button`}
        onClick={() => {
          props.updateData(props.data.productData.id, 0);
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
