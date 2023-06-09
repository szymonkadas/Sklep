import { DocumentData } from "firebase/firestore/lite";
import { HomePageComponentsData } from "../../pages/Home";

interface Cathegory {
  data: DocumentData;
  id: string;
}
export default function Cathegories(props: HomePageComponentsData) {
  const cathegories = props.data.map((cathegory: Cathegory) => {
    const localStyle = {
      backgroundImage: `url(${props.photosPath + cathegory.data.photo})`,
    };
    const data = cathegory.data;
    if (data.photo.length > 0) {
      return (
        <div className="cathgegories__cathegory-block" style={localStyle} key={`cathegory${cathegory.id}div`}>
          <h3 className="cathegories__cathegory-block__title">{data.title}</h3>
          <p className="cathegories__cathegory-block__description">{data.description}</p>
          <button className="cathegories__cathegory-block__button">See More</button>
        </div>
      );
    } else {
      return;
    }
  });
  return <div className="cathegories">{cathegories}</div>;
}
