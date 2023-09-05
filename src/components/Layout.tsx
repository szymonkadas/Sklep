import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { CollectionData, getCathegoriesData } from "../api";
import { createLoaderFunction } from "../utils/createLoaderFunction";
import Footer from "./Footer";
import Header from "./Header";

type LayoutLoaderData = {
  cathegories: CollectionData;
};
export type CathegoryData = {
  data: {
    cathegory: string;
    description: string;
    photo: string;
    title: string;
  };
  id: string;
};
export interface LayoutOutletContext extends ShoppingCartState {
  cathegoriesData: CathegoryData[];
}
export type ShoppingCartState = {
  shoppingCartData: string;
  setShoppingCartData: Dispatch<SetStateAction<string>>;
};
export const layoutLoader = await createLoaderFunction(
  [{ key: "cathegories", fetcher: getCathegoriesData }],
  "headerData"
);

export default function Layout() {
  const loaderData = useLoaderData() as LayoutLoaderData;
  const cathegoriesNames = useMemo(() => {
    return loaderData.cathegories.collectionData.map((cathegory: CathegoryData) => {
      return cathegory.data.cathegory;
    });
  }, [loaderData]);
  const [shoppingCartData, setShoppingCartData] = useState(localStorage.getItem("shoppingCart") || "[]");
  useEffect(() => {
    localStorage.setItem("shoppingCart", shoppingCartData);
  }, [shoppingCartData]);

  return (
    <div className="site-wrapper">
      <Header
        shoppingCartData={shoppingCartData}
        setShoppingCartData={setShoppingCartData}
        cathegories={cathegoriesNames}
      />
      <main>
        <Outlet
          context={{ cathegoriesData: loaderData.cathegories.collectionData, shoppingCartData, setShoppingCartData }}
        />
      </main>
      <Footer />
    </div>
  );
}
