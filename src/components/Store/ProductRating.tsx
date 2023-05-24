import { FC, useEffect, useState } from "react";
import { getProductRating } from "../../api";

type RatingProps = {
  ratingPath?: string;
  rating?: number;
  classNamePrefix: string;
};

// It just takes single rating and represents it with stars,
// it could be refactored if needed with other rating related components to work with array of opinions, and this would take its average, but for simplicity it's working on one opinion/rating project-wide.
// also it could be interactive on giving rating stage.
const ProductRating: FC<RatingProps> = (props) => {
  const [ratingData, setRatingData] = useState(0);
  useEffect(() => {
    if (props.rating) {
      setRatingData(props.rating);
    } else if (props.ratingPath) {
      getRatingData(props.ratingPath).then((data) => setRatingData(data.rating));
    } else {
      console.error("there was no rating path! nor ratingData");
      setRatingData(0);
    }
  }, []);
  const [stars, setStars] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const starElements = [];
    for (let i = 0; i < 5; i++) {
      if (i < ratingData) {
        starElements.unshift(
          <div className={`${props.classNamePrefix}__rating__star-container star-rating__star-container--active`}>
            <i className="star-rating__star-container__star"></i>
          </div>
        );
      } else if (starElements.length < 5) {
        starElements.push(
          <div className={`${props.classNamePrefix}__rating__star-container star-rating__star-container--inactive`}>
            <i className="star-rating__star-container__star"></i>
          </div>
        );
      } else {
        starElements.splice(5);
      }
    }
    setStars(starElements);
  }, [ratingData]);
  return <div className={`${props.classNamePrefix}__rating star-rating`}>{...stars}</div>;
};

export default ProductRating;

type ratingData = {
  rating: number;
  description: string;
};
export async function getRatingData(ratingPath: string) {
  const rating = localStorage.getItem(`productRating-${ratingPath}`);
  if (!rating) {
    return getProductRating(ratingPath).then((data) => {
      localStorage.setItem(`productRating-${ratingPath}`, JSON.stringify(data));
      return data.data;
    });
  } else {
    return JSON.parse(rating).data;
  }
}
