import { FC, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router";
import { NavLink, useSearchParams } from "react-router-dom";
import { ProductData } from "../../api";
import Price from "../../components/Store/ProductComponents/Price";
import ProductImage from "../../components/Store/ProductComponents/ProductImage";
import ProposalsOfProductTiles from "../../components/Store/ProductComponents/ProposalsOfProductTiles";
import RadioInput from "../../components/Store/ProductComponents/RadioInput";
import ProductRating, { getRatingData } from "../../components/Store/ProductRating";
import { currencySigns } from "../../utils/currencyUtils";
import getRouteParams from "../../utils/getRouteParams";
import addProductToSC from "../../utils/shoppingCart/addProductToSC";
import { ArrayData, allCathegoriesSelectorName } from "./StoreLayout";
const ProductPage: FC = () => {
  const classNamePrefix = "store__product-page";
  const [size, setSize] = useState("");
  const [additionalInfoCathegory, setAdditionalInfoCathegory] = useState("opis produktu");
  const [ratingData, setRatingData] = useState({
    rating: 0,
    description: "This product doesn't have any opinions so far.",
  });
  const { productsMap, filteredProductsMap } = useOutletContext() as {
    productsMap: Map<string, ProductData>;
    filteredProductsMap: Map<string, ProductData>;
  };
  const { currentCathegory, productId } = getRouteParams(
    useParams(),
    ["current_cathegory", "product_id"],
    [allCathegoriesSelectorName, ""]
  );
  const [searchParams, setSearchParam] = useSearchParams();
  const product = productId && productsMap.get(productId);
  // Jeśli nie ma takiego produktu no to wracamy do sklepu.
  const redirection = useNavigate();
  useEffect(() => {
    if (!product && productsMap.size > 0) {
      redirection(`/store/${currentCathegory}?${searchParams}`);
    } else if (product) {
      getRatingData(product.rating).then((data) => setRatingData(data));
    }
  }, []);
  // it has to be memoized due to it's nature (using random numbers) otherwise it will rerender.
  const Proposals = useMemo(
    () => (
      <ProposalsOfProductTiles
        filteredMap={filteredProductsMap}
        backupMap={productsMap}
        productId={productId}
        times={4}
      />
    ),
    []
  );
  const additionalInfoContent = useMemo(() => {
    switch (additionalInfoCathegory) {
      case "opis produktu":
        return (
          <p className="${classNamePrefix}--additional-info__description">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis autem laboriosam architecto eius at
            animi, voluptates quam fuga magni id, sunt quisquam cumque illum hic? Perferendis incidunt pariatur illum
            inventore.
          </p>
        );
      case "opinie":
        const desc =
          ratingData.description === "" ? "This product doesn't have any opinions so far." : ratingData.description;
        return (
          <div className="${classNamePrefix}--additional-info__opinions">
            <ProductRating
              rating={ratingData.rating}
              classNamePrefix={"${classNamePrefix}--additional-info__opinions"}
            ></ProductRating>
            <p className="${classNamePrefix}--additional-info__opinions__description">{desc}</p>
          </div>
        );
      default:
        <></>;
    }
  }, [additionalInfoCathegory, ratingData]);
  //if is needed for first run (until useEffect runs) and ts.
  if (product) {
    //If there's no such currency then it shouldn't be accepted.
    if (!currencySigns.get(product.currency)) {
      return <></>;
    }
    const opinionCount = ratingData.rating ? "1" : "0";
    const path = useLocation()
      .pathname.split("/")
      .reduce(
        (
          accum: { cumulatedPath: string; result: JSX.Element[] },
          part: string,
          index: number,
          arrayData: ArrayData
        ) => {
          if (part && index < arrayData.length - 1) {
            const cumulatedPath = accum.cumulatedPath + "/" + part;
            const result = [
              ...accum.result,
              <span key={`store-product-path-${part}${index}`}>
                <NavLink to={`${cumulatedPath}?${searchParams}`}>{part}</NavLink>/
              </span>,
            ];
            return { cumulatedPath, result };
          } else if (index == arrayData.length - 1) {
            const result = [...accum.result, <span key={`store-product-path-${product.name}`}>{product.name}</span>];
            return { cumulatedPath: accum.cumulatedPath, result };
          } else {
            return accum;
          }
        },
        { cumulatedPath: "", result: [] }
      ).result;
    const wearableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const RadioInputs = wearableSizes.map((sizeSign) => (
      <RadioInput<string>
        key={`size-picker-${sizeSign}`}
        classNamePrefix={`${classNamePrefix}__data__size-picker__size`}
        option={sizeSign}
        state={{ value: size, action: setSize }}
      />
    ));
    return (
      <article className="${classNamePrefix}--container">
        {/* product basic info */}
        <section className={`${classNamePrefix}`}>
          {/* ::before'a zrobić przed nim jeśli będzie discount. */}
          <figure className={`${classNamePrefix}__image-container`}>
            <ProductImage
              classNamePrefix="${classNamePrefix}"
              name={product.name}
              photo={product.photo}
              discount={product.discount}
            />
            {/* po hoverze na image powyżej, odpala się funkcja która obrazek poniżej pokazuje. (będzie ustawiony na tym  wyżej relativem/absolutem)
          Obrazek poniżej powinien być większy niż figure, (figure overflow hidden), 
          a przy pomocy funkcji z myszką (onmouseout, over, move) na nim określimy jego position top: i left: by był zzoomowany tam gdzie lecimy myszorem : D*/}
            {/* Po kliknięciu na którykolwiek z obrazków powinien się pokazać na środku ekranu obrazek 75vh z podpisem (nazwa produktu) 
          Ustawiony na środku (position absolute), z tłem na całą stronę czarnym z opacity 0.4-0.6 */}
            <img
              src={`/src/assets/${product.photo}`}
              alt={`${product.name}-image--zoom`}
              className={`product__image-zoom ${classNamePrefix}__image--zoom`}
              width="800px"
              style={{ opacity: "0" }}
            ></img>
          </figure>
          <div className={`product__data ${classNamePrefix}__data`}>
            <p className={`${classNamePrefix}__data__path`}>{path}</p>
            <h6 className={`product__data__name ${classNamePrefix}__data__name`}>{product.name}</h6>
            <Price
              classNamePrefix="${classNamePrefix}"
              discount={product.discount}
              discountPrice={product.discount_price}
              price={product.price}
              currency={product.currency}
            />
            <ul className={`${classNamePrefix}__data__size-picker`}>{...RadioInputs}</ul>
            <div className={`${classNamePrefix}__data__submit`}>
              <NavLink to="/shopping_cart">
                <button
                  className={`${classNamePrefix}__data__submit__button`}
                  onClick={() =>
                    addProductToSC({
                      cathegory: product.cathegory,
                      count: product.count,
                      currency: product.currency,
                      discount: product.discount,
                      discount_price: product.discount_price,
                      id: productId,
                      name: product.name,
                      photo: product.photo,
                      price: product.price,
                    })
                  }
                >
                  Dodaj do koszyka
                </button>
                <i>ikonka koszyka</i>
              </NavLink>
            </div>
          </div>
        </section>
        {/* product opinions + description of what its made of etc */}
        <section className={`${classNamePrefix}--additional-info`}>
          <ul className="${classNamePrefix}--additional-info__nav">
            <RadioInput<string>
              key={`radio-input-opis__produktu`}
              classNamePrefix={`${classNamePrefix}--additional-info__nav__option`}
              option="opis produktu"
              state={{ value: additionalInfoCathegory, action: setAdditionalInfoCathegory }}
            />

            <RadioInput<string>
              key={`radio-input-opinie`}
              classNamePrefix={`${classNamePrefix}--additional-info__nav__option`}
              option="opinie"
              state={{ value: additionalInfoCathegory, action: setAdditionalInfoCathegory }}
              count={opinionCount}
            />
          </ul>
          {additionalInfoContent}
        </section>
        {/* another products proposals */}
        <section className="${classNamePrefix}--proposals">
          <h4>Sprawdź również:</h4>
          {Proposals}
        </section>
      </article>
    );
  } else {
    return <></>;
  }
};

export default ProductPage;
