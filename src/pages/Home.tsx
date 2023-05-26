import { DocumentData } from "firebase/firestore/lite";
import { useLoaderData, useOutletContext } from "react-router";
import { hasOwnNestedProperty } from "../App";
import { CollectionData, DocData, getCoopBrandsData, getHeroData, getSpecialOfferData } from "../api";
import Brands from "../components/Home/Brands";
import Cathegories from "../components/Home/Cathegories";
import Hero from "../components/Home/Hero";
import IconTextBlock from "../components/Home/IconTextBlock";
import SpecialOffer from "../components/Home/SpecialOffer";
import { cathegoryData } from "../components/Layout";
import "../style/pages/css/Home.css";
import { createLoaderFunction } from "../utils/createLoaderFunction";

interface LoaderData {
  cathegories: CollectionData;
  coopBrands: CollectionData;
  hero: DocData;
  specialOffer: DocData;
}

export const homeLoader = await createLoaderFunction(
  [
    { key: "coopBrands", fetcher: getCoopBrandsData },
    { key: "hero", fetcher: getHeroData },
    { key: "specialOffer", fetcher: getSpecialOfferData },
  ],
  "homePageData"
);
export interface homePageComponentsData {
  data: DocumentData;
  photosPath?: string;
  // className?: string
}

export default function Home() {
  const loaderData = useLoaderData() as LoaderData;
  const cathegoriesData = useOutletContext() as cathegoryData[];
  const photosPath = "/src/assets/images";
  return (
    <>
      {/* loaderData.hero.heroData was put after hasOwnNested, because TS couldn't see that the problem with possible undefined was resolved so i safely put this after hONP */}
      {hasOwnNestedProperty(loaderData, "hero.data") && loaderData.hero.data && (
        <Hero data={loaderData.hero.data} photosPath={photosPath}></Hero>
      )}
      <section className="hp__section hp__section--1">
        {Object.hasOwn(loaderData, "coopBrands") && (
          <div className="brands-swiper">
            <button className="brands-swiper__button">
              <i className="brands-swiper__button--left"></i>
            </button>
            <div className="brands-swiper__container">
              <Brands data={loaderData.coopBrands.collectionData} photosPath={photosPath}></Brands>
            </div>
            <button className="brands-swiper__button">
              <i className="brands-swiper__button--right"></i>
            </button>
          </div>
        )}
        {cathegoriesData.length > 0 && <Cathegories data={cathegoriesData} photosPath={photosPath}></Cathegories>}
      </section>
      <section className="hp__section hp__section--2">
        <div className="products-wrapper">
          <h1 className="products__h1">Featured Products</h1>
        </div>
        {hasOwnNestedProperty(loaderData, "specialOffer.data") && loaderData.specialOffer.data && (
          <SpecialOffer data={loaderData.specialOffer.data} photosPath={photosPath} />
        )}
      </section>
      <section className="hp__section hp__section--1">
        <IconTextBlock iconPath={`${photosPath}/home/globe-free-img.png`} title="Wordlwide Shipping">
          It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </IconTextBlock>
        <IconTextBlock iconPath={`${photosPath}/home/quality-free-img.png`} title="Best Quality">
          It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </IconTextBlock>
        <IconTextBlock iconPath={`${photosPath}/home/lock-free-img.png`} title="SecurePayments">
          It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </IconTextBlock>
        <IconTextBlock iconPath={`${photosPath}/home/tag-free-img.png`} title="Best Offers">
          It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </IconTextBlock>
      </section>
    </>
  );
}
