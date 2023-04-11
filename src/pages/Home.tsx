import { useLoaderData } from "react-router";
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

interface LoaderParams {
  params: unknown;
  request: unknown;
}
// interface LoaderData {
//   cathegories: Promise<Cathegory[]>,
//   coopBrands: Promise<CoopBrand[]>,
//   hero: Promise<HeroData>,
//   specialOffer: Promise<SpecialOfferData>
// }
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
      coopBrands:data.coopBrands,
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

export default function Home(){
    const damian=useLoaderData();
    console.log(damian);
    return(
        <>
        </>
    )
}