import { FC, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { productData } from "../../api";
import ProductRating from "./ProductRating";
import { currencyConverter } from "./ProductTile";

const ProductPage: FC = () => {
  const productsMap: Map<string, productData> = useOutletContext();
  const { productId } = useParams();
  const product = productId && productsMap.get(productId);
  const redirection = useNavigate();
  useEffect(() => {
    if (!product) {
      redirection("/store");
    }
  }, []);
  if (product) {
    const currency: string = currencyConverter(product.currency);
    return (
      <div className={`store__product-page`}>
        {/* ::before'a zrobić przed nim jeśli będzie discount. */}
        <img
          src={`/src/assets/${product.photo}`}
          alt={`${product.name}-image`}
          className={`store__product-page__image${
            product.discount ? "--discount-active" : "--discount-inactive"
          }`}
          width="200px"
        ></img>
        <div className={`store__product-page__data`}>
          <h6 className={`store__product-page__data__name`}>{product.name}</h6>
          <p className={`store__product-page__data__cathegory`}>
            {product.cathegory}
          </p>
          <p className={`store__product-page__data__price`}>
            {product.discount && (
              <span className={`store__product-page__data__price__discount`}>
                {product.discount_price}
                &nbsp;
                <span className={`store__product-page__data__price__currency`}>
                  {currency}
                </span>
                &nbsp;
              </span>
            )}
            <span className={`store__product-page__data__price`}>
              {product.price}
              &nbsp;
              <span className={`store__product-page__data__price__currency`}>
                {currency}
              </span>
            </span>
          </p>
          <ProductRating
            classNamePrefix={`store__product-page__data`}
            ratingPath={product.rating}
          ></ProductRating>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default ProductPage;
