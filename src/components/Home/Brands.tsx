import { DocumentData } from "firebase/firestore/lite"
import { homePageComponentsData } from "../../pages/Home"

interface brand{
  collectionData: DocumentData
}
export default function Brands(props: homePageComponentsData){
  const brandsLogos = props.data.map( (brand:brand)  =>{
    const imgSource = props.photosPath + brand.collectionData.photo
    return <figure className="brands-swiper__slide-img-container" key={`brand${brand.collectionData.photo}`}>
      <img src={imgSource} className="brands-swiper__slide-img" alt={brand.collectionData.id}></img>
      </figure>
  })
  return(
    <>{brandsLogos}</>
  )
}