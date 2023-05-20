import { NavLink } from "react-router-dom";
import "../style/components/css/Header.css";
export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">Logo</div>
      <nav className="header__nav">
        <ol className="nav__nav-links">
          <li className="nav-links__li">
            <NavLink
              to="/"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Strona Główna{" "}
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/store"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              {" "}
              Sklep{" "}
            </NavLink>
            <div className="nav-links__li__sub-cathegories-wrapper">
              <div className="nav-links__li__sub-cathegories">
                <ol className="nav-links__li__sub-cathegories__listed-items">
                  <NavLink
                    to="/store/accesories"
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "active" : ""
                    }
                  >
                    Akcesoria
                  </NavLink>
                  <NavLink
                    to="/store/man"
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "active" : ""
                    }
                  >
                    Dla niego
                  </NavLink>
                  <NavLink
                    to="/store/woman"
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "active" : ""
                    }
                  >
                    Dla niej
                  </NavLink>
                </ol>
              </div>
            </div>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/account"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Konto
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/about"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              O nas
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/contact"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Kontakt
            </NavLink>
          </li>
          <li className="nav-links__li">
            <NavLink
              to="/ShoppingCart"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              {" "}
              600,92 <span className="currency">zł</span>
            </NavLink>
            {/* Zrób obramowanie, i before'a tak żeby wyglądało to na ikonkę koszyka */}
            <div className="nav-links__li__sub-cathegories-wrapper">
              <div className="nav-links__li__sub-cathegories">
                {/* Zrób by był slider, gridem do ogarnięcia ig i max-heightem*/}
                <ol className="nav-links__li__sub-cathegories__listed-items">
                  {/* <li>PRODUCT COMPONENT</li> */}
                </ol>
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
