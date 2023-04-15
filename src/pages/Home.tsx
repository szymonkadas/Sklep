import { DocumentData } from "firebase/firestore/lite";
import { useLoaderData } from "react-router";
import { hasOwnNestedProperty } from "../App";
import {
  Cathegory,
  CoopBrand,
  HeroData,
  SpecialOfferData,
  getCathegories,
  getCoopBrands,
  getHeroData,
  getSpecialOfferData
} from "../api";
import Brands from "../components/Home/Brands";
import Cathegories from "../components/Home/Cathegories";
import Hero from "../components/Home/Hero";
import IconTextBlock from "../components/Home/IconTextBlock";
import SpecialOffer from "../components/Home/SpecialOffer";
import "../style/pages/css/Home.css";

interface LoaderParams {
  params: unknown;
  request: unknown;
}
interface LoaderData {
  cathegories: Cathegory[];
  coopBrands: CoopBrand[];
  hero: HeroData;
  specialOffer: SpecialOfferData;
}
interface LoaderFunction {
  (params: LoaderParams): Promise<LoaderData>;
}

export const loader:LoaderFunction = async({ params, request })=>{
  //this localstorage if is created purely because of need to decrease api requests which are limited.
  //this could be decomponentised, to let products be rendered randomly etc, whilst rest be left in localstorage for some time.
  let homePageData = localStorage.getItem("homePageData")
  if(homePageData){
    const data: LoaderData = JSON.parse(homePageData)
    return{
      cathegories: data.cathegories,
      coopBrands: data.coopBrands,
      hero: data.hero,
      specialOffer: data.specialOffer
    }
  }
  else{
    console.log("API Request HomePage!")
    const data: LoaderData = {
      cathegories: await getCathegories(),
      coopBrands: await getCoopBrands(),
      hero: await getHeroData(),
      specialOffer: await getSpecialOfferData()
    }
    localStorage.setItem('homePageData', JSON.stringify(data))
    return data;
  }
}

export interface homePageComponentsData{
  data: DocumentData
  photosPath?: string
  // className?: string
}

export default function Home(){
    const loaderData = useLoaderData() as LoaderData;
    const photosPath = "/src/assets/images"
    return(
        <>
          {/* loaderData.hero.heroData was put after hasOwnNested, because TS couldn't see that the problem with possible undefined was resolved so i safely put this after hONP */}
          {hasOwnNestedProperty(loaderData, "hero.heroData") && loaderData.hero.heroData && 
          <Hero data={loaderData.hero.heroData} photosPath={photosPath}></Hero>}
          <section className="hp__section hp__section--1">
            {Object.hasOwn(loaderData, "coopBrands") && 
            <div className="brands-swiper">
              <button className="brands-swiper__button">
                <i className="brands-swiper__button--left"></i>
              </button>
              <div className="brands-swiper__container">
                <Brands data={loaderData.coopBrands} photosPath={photosPath}></Brands>
              </div>
              <button className="brands-swiper__button">
                <i className="brands-swiper__button--right"></i>
              </button>              
            </div>}
            {Object.hasOwn(loaderData, "cathegories") && 
            <Cathegories data={loaderData.cathegories} photosPath={photosPath}></Cathegories>
            }
          </section>
          <section className="hp__section hp__section--2">
            <div className="products-wrapper">
              <h1 className="products__h1">Featured Products</h1>
            </div>
            {hasOwnNestedProperty(loaderData, "specialOffer.specialOfferData") && loaderData.specialOffer.specialOfferData && 
            <SpecialOffer 
                data={loaderData.specialOffer.specialOfferData} 
                photosPath={photosPath} 
            />}
          </section>
          <section className="hp__section hp__section--1">
            <IconTextBlock 
              iconPath={`${photosPath}/home/globe-free-img.png`} 
              title="Wordlwide Shipping">
                It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </IconTextBlock>
            <IconTextBlock
              iconPath={`${photosPath}/home/quality-free-img.png`}
              title="Best Quality">
                It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </IconTextBlock>
            <IconTextBlock
              iconPath={`${photosPath}/home/lock-free-img.png`}
              title="SecurePayments">
                It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </IconTextBlock>
            <IconTextBlock
              iconPath={`${photosPath}/home/tag-free-img.png`}
              title="Best Offers">
                It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </IconTextBlock>
          </section>
        </>
    )
}