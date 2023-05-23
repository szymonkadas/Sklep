import { FC, useEffect, useState } from "react";
import { getProductRating } from "../../api";

type RatingProps = {
  ratingPath?: string;
  classNamePrefix: string;
};

const ProductRating: FC<RatingProps> = (props) => {
  const [ratingData, setRatingData] = useState(0);
  useEffect(() => {
    const rating = localStorage.getItem(`productRating-${props.ratingPath}`);
    if (!rating) {
      getProductRating(props.ratingPath).then((data) => {
        localStorage.setItem(
          `productRating-${props.ratingPath}`,
          JSON.stringify(data)
        );
        setRatingData(data.data.rating);
      });
    } else {
      setRatingData(JSON.parse(rating).data.rating);
    }
  }, []);
  const [stars, setStars] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const starElements = [];
    for (let i = 0; i < 5; i++) {
      if (i < ratingData) {
        starElements.unshift(
          <div
            className={`${props.classNamePrefix}__rating__star-container star-rating__star-container--active`}
          >
            <i className="star-rating__star-container__star"></i>
          </div>
        );
      } else if (starElements.length < 5) {
        starElements.push(
          <div
            className={`${props.classNamePrefix}__rating__star-container star-rating__star-container--inactive`}
          >
            <i className="star-rating__star-container__star"></i>
          </div>
        );
      } else {
        starElements.splice(5);
      }
    }
    setStars(starElements);
  }, [ratingData]);
  return (
    <div className={`${props.classNamePrefix}__rating star-rating`}>
      {...stars}
    </div>
  );
};

export default ProductRating;
