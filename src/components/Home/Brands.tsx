import { DocumentData } from "firebase/firestore/lite";
import { HomePageComponentsData } from "../../pages/Home";

interface Brand {
  data: DocumentData;
  id: string;
}
export default function Brands(props: HomePageComponentsData) {
  const brandsLogos = props.data.map((brand: Brand) => {
    const imgSource = props.photosPath + brand.data.photo;
    return (
      <figure className="brands-swiper__slide-img-container" key={`brand${brand.data.photo}`}>
        <img src={imgSource} className="brands-swiper__slide-img" alt={brand.data.id}></img>
      </figure>
    );
  });
  return <>{brandsLogos}</>;
}
