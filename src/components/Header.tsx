import { NavLink, useSearchParams } from "react-router-dom";
import { allCathegoriesSelectorName } from "../pages/store/StoreLayout";
import "../style/components/css/Header.css";

type headerProps = {
  cathegories: string[];
};
export default function Header(props: headerProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const storeNavLinks = props.cathegories.map((cathegory) => {
    return (
      <NavLink
        to={`/store/${cathegory}?${searchParams}`}
        className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
      >
        {cathegory[0].toUpperCase() + cathegory.slice(1, cathegory.length).toLowerCase()}
      </NavLink>
    );
  });
  return (
    <header className="header">
      <div className="header__logo">Logo</div>
      <nav className="header__nav">
        <ol className="nav__nav-links">
          <li className="nav-links__li">
            <NavLink
              to={`/?${searchParams}`}
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              Strona Główna{" "}
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to={`/store/${allCathegoriesSelectorName}?${searchParams}`}
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              {" "}
              Sklep{" "}
            </NavLink>
            <div className="nav-links__li__sub-cathegories-wrapper">
              <div className="nav-links__li__sub-cathegories">
                <ol className="nav-links__li__sub-cathegories__listed-items">{...storeNavLinks}</ol>
              </div>
            </div>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/account"
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              Konto
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/about"
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              O nas
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/contact"
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              Kontakt
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/ShoppingCart"
              className={({ isActive, isPending }) => (isPending ? "pending" : isActive ? "active" : "")}
            >
              {" "}
              600,92 <span className="currency">zł</span>
            </NavLink>
            {/* Zrób obramowanie, i before'a tak żeby wyglądało to na ikonkę koszyka */}
            <div className="nav-links__li__sub-cathegories-wrapper">
              <div className="nav-links__li__sub-cathegories">
                {/* Zrób by był slider, gridem do ogarnięcia ig i max-heightem*/}
                <ol className="nav-links__li__sub-cathegories__listed-items">{/* <li>PRODUCT COMPONENT</li> */}</ol>
                <div className="nav-links__li__sub-cathegories__sum">
                  <b>Kwota:</b> 600,92 <span className="currency">zł</span>
                </div>
                <NavLink to="/ShoppingCart">
                  <button>Zobacz Koszyk</button>
                </NavLink>
                <NavLink to="/Checkout">
                  <button>Zamów</button>
                </NavLink>
              </div>
              {/* LUB BRAK PRODUKTÓW W KOSZYKU */}
            </div>
          </li>
        </ol>
      </nav>
    </header>
  );
}
