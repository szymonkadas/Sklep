import { ChangeEvent, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { StoreData, allCathegoriesSelectorName } from "../../pages/store/StoreLayout";
import { CurrenciesMap } from "../../utils/currencyUtils";
import getRouteParams from "../../utils/getRouteParams";
import getSearchParams from "../../utils/getSearchParams";
import { changeSearchParams } from "../../utils/store/changeSearchParams";
import filterProducts from "../../utils/store/filterProducts";
import getPriceRange from "../../utils/store/getPriceRange";

export type PriceRange = {
  maxPrice: number;
  minPrice: number;
};

type PriceSetterProps = {
  currenciesMap: CurrenciesMap;
  defaultPriceRange: PriceRange;
};
// This component lets user filter products by price, using 2 inputs and slider (these are connected).
const PriceSetter: FC<PriceSetterProps> = (props: PriceSetterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { usersMaxPrice, usersMinPrice } = getSearchParams(searchParams, ["users_max_price", "users_min_price"]);
  const { selectedCurrency } = getSearchParams(searchParams, ["selected_currency"]);
  const { currentCathegory } = getRouteParams(useParams(), ["current_cathegory"], [allCathegoriesSelectorName]);
  const [min, setMin] = useState(usersMinPrice);
  const [max, setMax] = useState(usersMaxPrice);
  const [userHasSetMaxPrice, setUserHasSetMaxPrice] = useState(false);
  const [userHasSetMinPrice, setUserHasSetMinPrice] = useState(false);
  const [priceRangeValidity, setPriceRangeValidity] = useState(true);
  const products = useContext(StoreData).products;
  // used for slider max value.
  const maxPrice = useMemo(() => {
    if (props.defaultPriceRange.maxPrice > parseFloat(max)) {
      return props.defaultPriceRange.maxPrice;
    } else {
      return getPriceRange(products, props.currenciesMap, selectedCurrency).maxPrice;
    }
  }, [props.currenciesMap, selectedCurrency, currentCathegory]);
  const priceRangeOfCathegory = useMemo(
    () =>
      getPriceRange(
        filterProducts(products, props.currenciesMap, selectedCurrency, undefined, currentCathegory),
        props.currenciesMap,
        selectedCurrency
      ),
    [currentCathegory, selectedCurrency, props.currenciesMap]
  );

  const pricePattern = /^\d{0,5}([.,]\d+)?$/; //only values in range <0; maxInputPrice> and "";
  const incorrectPriceRangeClass = priceRangeValidity ? "" : "store-aside__price-filter__input--incorrect";

  function savePriceRangeChanges(value: string, setter: React.Dispatch<React.SetStateAction<string>>) {
    setter(value);
    setTimeout(submitUsersPriceRange, 250);
  }

  const submitUsersPriceRange = () => {
    checkPriceRangeValidity(min, max);
    if (priceRangeValidity) {
      const keys = [];
      const values = [];
      if (userHasSetMaxPrice) {
        keys.push("users_max_price");
        values.push(max);
      } else {
        searchParams.delete("users_max_price");
      }
      if (userHasSetMinPrice) {
        keys.push("users_min_price");
        values.push(min);
      } else {
        searchParams.delete("users_min_price");
      }
      changeSearchParams(searchParams, keys, values);
      setSearchParams(searchParams);
    }
    return;
  };

  const checkPriceRangeValidity = useCallback((min: string, max: string) => {
    if (!pricePattern.test(max) || !pricePattern.test(min)) {
      setPriceRangeValidity(false);
    } else {
      setPriceRangeValidity(true);
      if (min !== "") {
        if (max !== "") {
          let minimal: number = parseFloat(min);
          let maximal: number = parseFloat(max);
          if (parseFloat(min) > parseFloat(max)) {
            setMin(maximal.toFixed(2));
            setMax(minimal.toFixed(2));
          } else {
            setMin(minimal.toFixed(2));
            setMax(maximal.toFixed(2));
          }
        } else {
          setMin(parseFloat(min).toFixed(2));
        }
      } else {
        if (max !== "") {
          setUserHasSetMaxPrice(true);
        } else {
          setUserHasSetMaxPrice(false);
        }
        setMin("");
        setUserHasSetMinPrice(false);
      }
    }
  }, []);

  const handleFinishedChanges = (event: ChangeEvent<HTMLInputElement>) => {
    checkPriceRangeValidity(min, max);
  };
  // price slider params calculated by min, max, priceRangeOfCathegory variables
  const priceSlider = useMemo(() => {
    let minimal = 0;
    let presetMin: number = min ? parseFloat(min) : priceRangeOfCathegory.minPrice;
    let maximal = Math.ceil(maxPrice);
    let presetMax: number = max && parseFloat(max) < maximal ? parseFloat(max) : priceRangeOfCathegory.maxPrice;
    return {
      minimal: minimal,
      presetMin: presetMin,
      maximal: Math.ceil(maximal),
      presetMax: Math.ceil(presetMax),
    };
  }, [min, max, priceRangeOfCathegory]);

  const handleSliderChange = (event: any) => {
    // had to use inner function cuz couldn't assign such type to event argument ehu.
    function properHandler(event: SimpleRangeEvent) {
      setMin(event.detail.minRangeValue.toFixed(2));
      setMax(event.detail.maxRangeValue.toFixed(2));
      setUserHasSetMaxPrice(true);
      setUserHasSetMinPrice(true);
      setPriceRangeValidity(true);
    }
    properHandler(event);
  };
  const priceLabelStyle: React.CSSProperties = {
    fontSize: "0px",
  };
  useEffect(() => window.addEventListener("slider-price-change", handleSliderChange), []);

  // updating changes on currency change (such change automatically changes usersPrice range) + other activities that may change usersMaxPrice/minPrice.
  useEffect(() => {
    setMax(usersMaxPrice);
    setMin(usersMinPrice);
  }, [usersMaxPrice, usersMinPrice]);
  return (
    <div className="store-aside__price-filter-layout">
      <h4>Filter by price</h4>
      <div className="store-aside__price-filter">
        {/* min and max labels are for simpleRange inputs id's */}
        <label style={priceLabelStyle} htmlFor="set-min-price">
          {min}
        </label>
        <input
          id="set-min-price"
          key="priceSetterMin"
          className={`store-aside__price-filter__input ${incorrectPriceRangeClass}`}
          type="text"
          value={min}
          onChange={(event) => {
            setMin(event.target.value);
            setUserHasSetMinPrice(true);
          }}
          onBlur={(event) => handleFinishedChanges(event)}
          placeholder={priceRangeOfCathegory.minPrice.toFixed(2)}
        ></input>
        <span className="store-aside__price-filter__input-divider"> - </span>
        <label style={priceLabelStyle} htmlFor="max">
          {max}
        </label>
        <input
          name="set-max-price"
          key="priceSetterMax"
          className={`store-aside__price-filter__input ${incorrectPriceRangeClass}`}
          type="text"
          value={max}
          onChange={(event) => {
            setMax(event.target.value);
            setUserHasSetMaxPrice(true);
          }}
          onBlur={(event) => handleFinishedChanges(event)}
          placeholder={priceRangeOfCathegory.maxPrice.toFixed(2)}
        ></input>
        <button className="store-aside__price-filter__interface-button" onClick={() => submitUsersPriceRange()}>
          Search
        </button>
      </div>
      <div className="store-aside__price-filter__interface-slider">
        {/* https://github.com/maxshuty/accessible-web-components */}
        <range-selector
          min-range={priceSlider.minimal}
          preset-min={priceSlider.presetMin}
          max-range={priceSlider.maximal}
          preset-max={priceSlider.presetMax}
          event-name-to-emit-on-change="slider-price-change"
          hide-label
          hide-legend
          // inputs-for-labels
        />
      </div>
    </div>
  );
};

export default PriceSetter;
