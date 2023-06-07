import { FC } from "react";

type ProductImageProps = {
  classNamePrefix: string;
  name: string;
  photo: string;
  discount: boolean;
};
const ProductImage: FC<ProductImageProps> = (props) => {
  return (
    <img
      src={`/src/assets/${props.photo}`}
      alt={`${props.name}-image`}
      className={`product__image ${props.classNamePrefix}__image${
        props.discount ? "--discount-active" : "--discount-inactive"
      }`}
      width="200px"
    ></img>
  );
};

export default ProductImage;
