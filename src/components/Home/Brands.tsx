import { DocumentData } from "firebase/firestore/lite"
import { homePageComponentsData } from "../../pages/Home"

interface brand{
  data: DocumentData,
  id: string
}
export default function Brands(props: homePageComponentsData){
  const brandsLogos = props.data.map( (brand:brand)  =>{
    const imgSource = props.photosPath + brand.data.photo
    return <figure className="brands-swiper__slide-img-container" key={`brand${brand.data.photo}`}>
      <img src={imgSource} className="brands-swiper__slide-img" alt={brand.data.id}></img>
      </figure>
  })
  return(
    <>{brandsLogos}</>
  )
}