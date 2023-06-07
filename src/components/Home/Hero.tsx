import { HomePageComponentsData } from "../../pages/Home";

export default function Hero(props: HomePageComponentsData) {
  const localStyle = {
    backgroundImage: `linear-gradient(rgba(0,31,45,0.4), rgba(0,31,45,0.4)), url(${
      props.photosPath + props.data.photo
    })`,
  };
  return (
    <section className="hp__hero" style={localStyle}>
      <div className="hp__hero__layout">
        <article className="hp__hero__text-content-container">
          <h1 className="hero__title">{props.data.title}</h1>
          <h4 className="hero__description">{props.data.description}</h4>
          <button className="hero__button hero__button--filled">Shop Now</button>
          <button className="hero__button hero__button--unfilled">Find More</button>
        </article>
      </div>
    </section>
  );
}
