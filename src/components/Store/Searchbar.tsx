import {
  ChangeEvent,
  FC,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StoreData,
  arrayData,
  fetchedProductData,
  filterProducts,
} from "../../pages/store/StoreLayout";
import { priceRange } from "./PriceSetter";
interface SearchbarProps {
  searchVal: string;
  setSearchVal: React.Dispatch<React.SetStateAction<string>>;
  currentCathegory: string;
  setCurrentCathegory: React.Dispatch<React.SetStateAction<string>>;
  usersPriceRange: priceRange;
}

const Searchbar: FC<SearchbarProps> = (props: SearchbarProps) => {
  //State and memoVariables
  const clearFiltersStatus = useContext(StoreData).clearFiltersStatus;
  const [searchbarVal, setSearchbarVal] = useState(props.searchVal);
  const [selectedCathegory, setSelectedCathegory] = useState(
    props.currentCathegory
  );
  //merged allCathegoriesSelector name with other cathegories names
  const cathegoriesContext: string[] = [
    useContext(StoreData).allCathegoriesSelector.cathegoryName,
  ].concat(
    useContext(StoreData).cathegories.map(
      (cathegory) => cathegory.cathegoryName
    )
  );
  const cathegoriesSelectElements: JSX.Element[] = useMemo(
    () =>
      cathegoriesContext.map((cathegory) => (
        <option key={`searchbar-select-${cathegory}`} value={cathegory}>
          {cathegory}
        </option>
      )),
    []
  );
  // search proposals array of proposal elements.
  const [proposals, setProposals] = useState<JSX.Element[]>([]);
  //indicates whether a search is happening
  const [searchingState, setSearchingState] = useState(false);
  const [searchbarIsFocused, setSearchbarIsFocused] = useState(false);
  const [searchbarContainerIsHovered, setSearchbarContainerIsHovered] =
    useState(false);
  const wasFocused: boolean = useDeferredValue(searchbarIsFocused);
  const proposalsVisibility: "--active" | "--inactive" = useMemo(() => {
    if (searchbarIsFocused) return "--active";
    else if (searchbarContainerIsHovered && wasFocused) return "--active";
    return "--inactive";
  }, [searchbarContainerIsHovered, searchbarIsFocused]);
  let changeTimeoutRef: React.MutableRefObject<NodeJS.Timeout | false> =
    useRef(false);
  const products = useContext(StoreData).products;

  //updates the search proposals based on the provided search bar value and cathegory;
  const updateProposals = (sBvalue: string, cathegory: string) => {
    if (changeTimeoutRef.current) clearTimeout(changeTimeoutRef.current);
    if (sBvalue !== "") {
      setSearchingState(true);
      changeTimeoutRef.current = setTimeout(() => {
        const filteredData = createProductNames(
          filterProducts(products, sBvalue, cathegory, props.usersPriceRange)
        );
        const filteredProposals = filteredData.map(
          (productName: string, index: number) => {
            return (
              index < 3 && (
                <li
                  key={`product-proposal-${productName}${index}`}
                  className="store-aside__searchbar-proposals__list__item"
                >
                  {productName}
                </li>
              )
            );
          }
        );
        setProposals(filteredProposals);
        setSearchingState(false);
      }, 1000);
    } else {
      setProposals([]);
      setSearchingState(false);
    }
  };

  const handleSearchbarChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchbarVal(event.target.value);
    updateProposals(event.target.value, selectedCathegory);
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCathegory(event.target.value);
    updateProposals(searchbarVal, event.target.value);
  };

  const submitSearchbar = () => {
    props.setSearchVal(searchbarVal.trim().toLowerCase());
    props.setCurrentCathegory(selectedCathegory);
    setProposals([]);
  };

  // updating state when relative values get updated
  useEffect(() => {
    if (clearFiltersStatus) {
      setSearchbarVal("");
      setSelectedCathegory("");
      setProposals([]);
    }
  }, [props.searchVal, props.currentCathegory, props.usersPriceRange]);
  useEffect(() => {
    if (!clearFiltersStatus) {
      setSelectedCathegory(props.currentCathegory);
      setProposals([]);
      updateProposals(searchbarVal, props.currentCathegory);
    }
  }, [props.currentCathegory]);

  const labelStyle: React.CSSProperties = {
    fontSize: "0px",
  };
  //It includes an input element for the search bar, a select dropdown for selecting a cathegory, a button for submitting, and a list for search proposals.
  return (
    <div
      className="store-aside__searchbar-layout"
      onMouseEnter={() => setSearchbarContainerIsHovered(true)}
      onMouseLeave={() => setSearchbarContainerIsHovered(false)}
    >
      <div className="store-aside__searchbar">
        <input
          key="storeSearchbar"
          type="search"
          className="store-aside__searchbar__input"
          value={searchbarVal}
          onChange={handleSearchbarChange}
          onFocus={() => setSearchbarIsFocused(true)}
          onBlur={() => setSearchbarIsFocused(false)}
          placeholder="Search products"
        ></input>
        <div className="store-aside__searchbar__cathegory">
          <label style={labelStyle} htmlFor="searchbar__cathegory-select">
            select cathegory
          </label>
          <select
            id="searchbar__cathegory-select"
            value={selectedCathegory}
            onChange={(event) => handleSelectChange(event)}
          >
            {cathegoriesSelectElements}
            {/* custom select example: 
                        https://www.w3schools.com/howto/tryit.asp?filename=tryhow_custom_select */}
          </select>
        </div>
        <button
          className="store-aside__searchbar__submit"
          onClick={() => {
            // May be needed to add some logic to lose visibility of proposals after searching.
            submitSearchbar();
          }}
        >
          Search
        </button>
      </div>
      <div className={`store-aside__searchbar-proposals${proposalsVisibility}`}>
        <ul className="store-aside__searchbar-proposals__list">
          {...proposals}
          {proposals.length > 0 ? (
            proposals.length > 3 && (
              <li className="store-aside__searchbar-proposals__list__sub-item">
                {proposals.length - 3} more products
              </li>
            )
          ) : (!searchingState && searchbarVal.length > 0) ||
            (!searchingState && props.searchVal.length > 0) ? (
            <li className="store-aside__searchbar-proposals__list__sub-item">
              Couldn't find products, try restarting filters
            </li>
          ) : (
            searchingState &&
            searchbarVal.length > 0 && (
              <li className="store-aside__searchbar-proposals__list__sub-item">
                Searching...
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

function createProductNames(data: arrayData) {
  return data.map((product: fetchedProductData) => {
    return product.data.name;
  });
}

export default Searchbar;
