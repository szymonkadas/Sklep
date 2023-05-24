import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductTile from "../../components/Store/ProductTile";
import { arrayData, fetchedProductData } from "./StoreLayout";

type StoreProps = {
  filteredProducts: arrayData;
};

const Store: FC<PropsWithChildren<StoreProps>> = (props) => {
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const data = props.filteredProducts.map((product: fetchedProductData) => {
      return (
        <ProductTile
          key={`product-${product.id}`}
          classNamePrefix="store"
          {...product.data}
          id={product.id}
        ></ProductTile>
      );
    });
    setProducts(data);
  }, [props.filteredProducts]);
  const content = productId ? (
    <>{props.children}</>
  ) : (
    <section className="store">{products}</section>
  );
  return content;
};

export default Store;
