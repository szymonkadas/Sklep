import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ProductData } from "../../api";
import ProductTile from "../../components/Store/ProductTile";
import getRouteParams from "../../utils/getRouteParams";
import { ArrayData, FetchedProductData } from "./StoreLayout";

const Store: FC<PropsWithChildren> = () => {
  const { currentCathegory } = getRouteParams(useParams(), ["current_cathegory"], [""]);
  const redirection = useNavigate();
  useEffect(() => {
    if (currentCathegory === "") {
      redirection(`/store/all?${useSearchParams()[0]}`);
    }
  }, []);
  const { productId } = getRouteParams(useParams(), ["product_id"], [""]);
  const [products, setProducts] = useState([<></>]);
  const { filteredProducts, productsMap } = useOutletContext() as {
    filteredProducts: ArrayData;
    productsMap: Map<string, ProductData>;
  };
  const filteredProductsMap = useMemo(() => {
    const productsMap = new Map<string, ProductData>();
    filteredProducts.forEach((product: FetchedProductData) => {
      productsMap.set(product.id, product.data);
    });
    return productsMap;
  }, [filteredProducts]);
  useEffect(() => {
    const data = filteredProducts.map((product: FetchedProductData) => {
      return (
        <ProductTile
          key={`product-tile-${product.id}`}
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
    <section className="store">{...products}</section>
  );
  return content;
};

export default Store;
