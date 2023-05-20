import { homePageComponentsData } from "../../pages/Home";

export default function SpecialOffer(props: homePageComponentsData) {
  const localStyle = {
    backgroundImage: `url(${props.photosPath + props.data.photo})`,
  };
  return (
    <div className="special-offer" style={localStyle}>
      <h6 className="special-offer__subtitle">{props.data.offer_type}</h6>
      <h3 className="special-offer__title">{props.data.title}</h3>
      <p className="special-offer__description">{props.data.description}</p>
      <h6 className="special-offer__subtitle">{props.data.summary}</h6>
      <button className="special-offer__button">See More</button>
    </div>
  );
}
