import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { productData } from "../../api";
import ProductTile from "../../components/Store/ProductTile";
import getRouteParams from "../../utils/getRouteParams";
import { arrayData, fetchedProductData } from "./StoreLayout";

// type StoreProps = {
//   filteredProducts: arrayData;
// };
// PROBLEM: PRZY KLIKANIU PRZEZ NAVBAR NIE USTAWIA PARAMETRÓW! ORAZ: JAK JEST STORE NIE USTAWIA /ALL!
const Store: FC<PropsWithChildren> = (props) => {
  const { currentCathegory } = getRouteParams(useParams(), ["currentCathegory"], [""]);
  useEffect(() => {
    if (currentCathegory === "") {
      useNavigate()(`/store/all?${useSearchParams()[0]}`);
    }
  }, []);
  const { productId } = useParams();
  const [products, setProducts] = useState([<></>]);
  const { filteredProducts, productsMap } = useOutletContext() as {
    filteredProducts: arrayData;
    productsMap: Map<string, productData>;
  };
  const filteredProductsMap = useMemo(() => {
    const productsMap = new Map<string, productData>();
    filteredProducts.forEach((product: fetchedProductData) => {
      productsMap.set(product.id, product.data);
    });
    return productsMap;
  }, [filteredProducts]);

  useEffect(() => {
    const data = filteredProducts.map((product: fetchedProductData) => {
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
  }, [filteredProducts]);
  const content = productId ? (
    <Outlet context={{ productsMap, filteredProductsMap }}></Outlet>
  ) : (
    <section className="store">{products}</section>
  );
  return content;
};

export default Store;
