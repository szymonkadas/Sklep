import { FC, useContext } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { StoreData, allCathegoriesSelectorName } from "../../pages/store/StoreLayout";
import getRouteParams from "../../utils/getRouteParams";

export interface StoreDisplayCathegory {
  cathegoryName: string;
  differentProductsCount: number;
}
interface CathegoriesProps {
  filteredCathegoriesProductMap: Map<string, number>;
}

const CathegoriesFilter: FC<CathegoriesProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentCathegory } = getRouteParams(useParams(), ["current_cathegory"], [allCathegoriesSelectorName]);
  const allCathegoriesSelector = useContext(StoreData).allCathegoriesSelector;
  // tracks total number of filtered products, shaped while making cathegories.
  let filteredProductsSum = 0;
  // array of cathegory elements, such element onClick changes Store cathegory filter
  const cathegories = useContext(StoreData).cathegories.map((cathegory) => {
    let filteredProductsCount = 0;
    if (props.filteredCathegoriesProductMap.has(cathegory.cathegoryName)) {
      filteredProductsCount = props.filteredCathegoriesProductMap.get(cathegory.cathegoryName)!;
    }
    filteredProductsSum += filteredProductsCount;
    const activeClass = currentCathegory === cathegory.cathegoryName ? "--active" : "--inactive";
    return (
      <li className="store-aside__cathegories-filter__listing">
        <NavLink
          to={`/store/${cathegory.cathegoryName}?${searchParams}`}
          className={`store-aside__cathegories-filter__listing__link${activeClass}`}
        >
          {cathegory.cathegoryName}
        </NavLink>
        <span className="store-aside__cathegories-filter__listing__products-count">
          (<b>{filteredProductsCount}</b>/{cathegory.differentProductsCount})
        </span>
      </li>
    );
  });
  //Essentially list of cathegories
  return (
    <div className="store-aside__cathegories-filter">
      <h4>Browse by cathegories</h4>
      <ul className="store-aside__cathegories-filter__list">
        <li className="store-aside__cathegories-filter__listing">
          <NavLink
            to={`/store/all?${searchParams}`}
            className={`store-aside__cathegories-filter__listing__link${
              currentCathegory === "" ? "--active" : "--inactive"
            }`}
          >
            {allCathegoriesSelector.cathegoryName}
          </NavLink>
          <span className="store-aside__cathegories-filter__listing__products-count">
            (<b>{filteredProductsSum}</b>/{allCathegoriesSelector.differentProductsCount})
          </span>
        </li>
        {...cathegories}
      </ul>
    </div>
  );
};
export default CathegoriesFilter;
