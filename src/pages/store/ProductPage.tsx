import { FC, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router";
import { NavLink } from "react-router-dom";
import { productData } from "../../api";
import ProductRating, { getRatingData } from "../../components/Store/ProductRating";
import ProductTile, { currencyConverter } from "../../components/Store/ProductTile";
import { arrayData } from "./StoreLayout";

const ProductPage: FC = () => {
  const [size, setSize] = useState("");
  const [additionalInfoCathegory, setAdditionalInfoCathegory] = useState("opis produktu");
  const [ratingData, setRatingData] = useState({
    rating: 0,
    description: "This product doesn't have any opinions so far.",
  });
  const productsMap: Map<string, productData> = useOutletContext();
  const { productId } = useParams();
  const product = productId && productsMap.get(productId);
  // Jeśli nie ma takiego produktu no to wracamy do sklepu.
  const redirection = useNavigate();
  useEffect(() => {
    if (!product) {
      redirection("/store");
    } else {
      getRatingData(product.rating).then((data) => setRatingData(data));
    }
  }, []);
  const additionalInfoContent = useMemo(() => {
    switch (additionalInfoCathegory) {
      case "opis produktu":
        return (
          <p className="store__product-page--additional-info__description">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis autem laboriosam architecto eius at
            animi, voluptates quam fuga magni id, sunt quisquam cumque illum hic? Perferendis incidunt pariatur illum
            inventore.
          </p>
        );
      case "opinie":
        const desc =
          ratingData.description === "" ? "This product doesn't have any opinions so far." : ratingData.description;
        return (
          <div className="store__product-page--additional-info__opinions">
            <ProductRating
              rating={ratingData.rating}
              classNamePrefix={"store__product-page--additional-info__opinions"}
            ></ProductRating>
            <p className="store__product-page--additional-info__opinions__description">{desc}</p>
          </div>
        );
      default:
        <></>;
    }
  }, [additionalInfoCathegory, ratingData]);
  // i tak wiadomo że product jest zdefiniowany już na tym etapie po useEffect ale jest to potrzebne dla pierwszego "biegu"/ts.
  if (product) {
    const currency: string = currencyConverter(product.currency);
    const opinionCount = ratingData.rating ? "1" : "0";
    const Proposals = createNeighbourProductTilesArray(productsMap, productId, 4);
    const path = useLocation()
      .pathname.split("/")
      .reduce(
        (
          accum: { cumulatedPath: string; result: JSX.Element[] },
          part: string,
          index: number,
          arrayData: arrayData
        ) => {
          if (part && index < arrayData.length - 1) {
            const cumulatedPath = accum.cumulatedPath + "/" + part;
            const result = [
              ...accum.result,
              <>
                <NavLink to={cumulatedPath}>{part}</NavLink>/
              </>,
            ];
            return { cumulatedPath, result };
          } else if (index == arrayData.length - 1) {
            const result = [...accum.result, <>{product.name}</>];
            return { cumulatedPath: accum.cumulatedPath, result };
          } else {
            return accum;
          }
        },
        { cumulatedPath: "", result: [] }
      ).result;
    return (
      <article className="store__product-page--container">
        {/* product basic info */}
        <section className={`store__product-page`}>
          {/* ::before'a zrobić przed nim jeśli będzie discount. */}
          <figure className={`store__product-page__image-container`}>
            <img
              src={`/src/assets/${product.photo}`}
              alt={`${product.name}-image`}
              className={`product__image store__product-page__image${
                product.discount ? "--discount-active" : "--discount-inactive"
              }`}
              width="400px"
            ></img>
            {/* po hoverze na image powyżej, odpala się funkcja która obrazek poniżej pokazuje. (będzie ustawiony na tym  wyżej relativem/absolutem)
          Obrazek poniżej powinien być większy niż figure, (figure overflow hidden), 
          a przy pomocy funkcji z myszką (onmouseout, over, move) na nim określimy jego position top: i left: by był zzoomowany tam gdzie lecimy myszorem : D*/}
            {/* Po kliknięciu na którykolwiek z obrazków powinien się pokazać na środku ekranu obrazek 75vh z podpisem (nazwa produktu) 
          Ustawiony na środku (position absolute), z tłem na całą stronę czarnym z opacity 0.4-0.6 */}
            <img
              src={`/src/assets/${product.photo}`}
              alt={`${product.name}-image--zoom`}
              className={`product__image-zoom store__product-page__image--zoom`}
              width="800px"
              style={{ opacity: "0" }}
            ></img>
          </figure>
          <div className={`product__data store__product-page__data`}>
            <p className={`store__product-page__data__path`}>{path}</p>
            <h6 className={`product__data__name store__product-page__data__name`}>{product.name}</h6>
            <p className={`product__data__price store__product-page__data__price`}>
              <span
                className={`product__data__price__regular${
                  product.discount && "--inactive"
                } store__product-page__data__price__regular${product.discount && "--inactive"}`}
              >
                {product.price}
                &nbsp;
                <span className={`product__data__price__currency store__product-page__data__price__currency`}>
                  {currency}
                </span>
              </span>
              {product.discount && (
                <span className={`product__data__price__discount store__product-page__data__price__discount`}>
                  {product.discount_price}
                  &nbsp;
                  <span className={`product__data__price__currency store__product-page__data__price__currency`}>
                    {currency}
                  </span>
                  &nbsp;
                </span>
              )}
            </p>
            <ul className={`store__product-page__data__size-picker`}>
              {createRadioInput<string>("store__product-page__data__size-picker__size", "XS", {
                value: size,
                action: setSize,
              })}
              {createRadioInput<string>("store__product-page__data__size-picker__size", "S", {
                value: size,
                action: setSize,
              })}
              {createRadioInput<string>("store__product-page__data__size-picker__size", "M", {
                value: size,
                action: setSize,
              })}
              {createRadioInput<string>("store__product-page__data__size-picker__size", "L", {
                value: size,
                action: setSize,
              })}
              {createRadioInput<string>("store__product-page__data__size-picker__size", "XL", {
                value: size,
                action: setSize,
              })}
              {createRadioInput<string>("store__product-page__data__size-picker__size", "XXL", {
                value: size,
                action: setSize,
              })}
            </ul>
            <div className={`store__product-page__data__submit`}>
              <button> DO KOSZYKA </button>
              <i>ikonka koszyka</i>
            </div>
          </div>
        </section>
        {/* product opinions + description of what its made of etc */}
        <section className={`store__product-page--additional-info`}>
          <ul className="store__product-page--additional-info__nav">
            {createRadioInput<string>("store__product-page--additional-info__nav__option", "opis produktu", {
              value: additionalInfoCathegory,
              action: setAdditionalInfoCathegory,
            })}
            {createRadioInput<string>(
              "store__product-page--additional-info__nav__option",
              "opinie",
              {
                value: additionalInfoCathegory,
                action: setAdditionalInfoCathegory,
              },
              opinionCount
            )}
          </ul>
          {additionalInfoContent}
        </section>
        {/* another products proposals */}
        <section className="store__product-page--proposals">
          <h4>Sprawdź również:</h4>
          {...Proposals}
        </section>
      </article>
    );
  } else {
    return <></>;
  }
};

export default ProductPage;

//Funkcja do zrobienia arraya sąsiednich produktów z podanej ilości produktów z mapy.
function createNeighbourProductTilesArray(
  map: Map<string, productData>,
  productId: string,
  times: number
): JSX.Element[] {
  const id = parseInt(productId);
  const result = [];
  for (let i = 1; i <= times; i++) {
    if (map.has(`${id + i}`) && map.get(`${id + i}`)) {
      const productData = map.get(`${id + i}`) as productData;
      result.push(
        <ProductTile
          classNamePrefix="store__product-page--propsals"
          {...productData}
          id={`${parseInt(productId) + i}`}
        ></ProductTile>
      );
    } else if (map.has(`${id + i - 4}`) && map.get(`${id + i - 4}`)) {
      const productData = map.get(`${parseInt(productId) + i - 4}`) as productData;
      result.push(
        <ProductTile
          classNamePrefix="store__product-page--propsals"
          {...productData}
          id={`${parseInt(productId) + i - 4}`}
        ></ProductTile>
      );
    }
  }
  return result;
}

function createRadioInput<t extends string | number>(
  classNamePrefix: string,
  option: t,
  state: {
    value: t;
    action: React.Dispatch<React.SetStateAction<t>>;
  },
  count?: string
): JSX.Element {
  const sizeOptionStyle = {
    display: "block",
    height: "0",
    width: "0",
    opacity: "0",
    padding: "0",
    margin: "0",
  };
  return (
    <li
      key={`${classNamePrefix}--option${option}`}
      onClick={() => state.action(option)}
      className={`${classNamePrefix}--container`}
    >
      <label
        htmlFor={`${classNamePrefix}--option${option}`}
        className={`${classNamePrefix}--${state.value === option ? "active" : "inactive"}`}
      >
        {`${option}${count ? "(" + count + ")" : ""}`}
      </label>
      <input
        type="radio"
        style={{ ...sizeOptionStyle }}
        id={`${classNamePrefix}--option${option}`}
        value={state.value}
        onClick={() => state.action(option)}
      ></input>
    </li>
  );
}
