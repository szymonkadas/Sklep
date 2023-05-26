import { useMemo } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { CollectionData, getCathegoriesData } from "../api";
import { createLoaderFunction } from "../utils/createLoaderFunction";
import Footer from "./Footer";
import Header from "./Header";

type headerData = {
  cathegories: CollectionData;
};
export type cathegoryData = {
  data: {
    cathegory: string;
    description: string;
    photo: string;
    title: string;
  };
  id: string;
};
export const headerLoader = await createLoaderFunction(
  [{ key: "cathegories", fetcher: getCathegoriesData }],
  "headerData"
);
export default function Layout() {
  const headerData = useLoaderData() as headerData;
  const cathegoriesNames = useMemo(() => {
    return headerData.cathegories.collectionData.map((cathegory: cathegoryData) => {
      return cathegory.data.cathegory;
    });
  }, [headerData]);

  return (
    <div className="site-wrapper">
      <Header cathegories={cathegoriesNames} />
      <main>
        <Outlet context={headerData.cathegories.collectionData} />
      </main>
      <Footer />
    </div>
  );
}
