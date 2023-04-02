import { NavLink } from "react-router-dom";
import "../style/components/css/Header.css";
export default function Header(){
    return(
        <header>
            <div>Logo</div>
            <nav>
                <ol className="nav-links">
                    <li><NavLink to="/" className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }>Strona Główna </NavLink></li>
                    <li><NavLink to="/store" className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }>
                        Sklep 
                        <div className="sub-cathegories-wrapper">
                            <div className="sub-cathegories">
                                <ol className="sub-cathegories-listed-items">
                                    <NavLink to="/store/accesories" className={({ isActive, isPending }) =>
                                    isPending ? "pending" : isActive ? "active" : ""
                                    }>Akcesoria</NavLink>
                                    <NavLink to="/store/man" className={({ isActive, isPending }) =>
                                        isPending ? "pending" : isActive ? "active" : ""
                                    }>Dla niego</NavLink>
                                    <NavLink to="/store/woman" className={({ isActive, isPending }) =>
                                        isPending ? "pending" : isActive ? "active" : ""
                                    }>Dla niej</NavLink>
                                </ol>
                            </div>
                        </div>

                    </NavLink></li>
                    <li><NavLink to="/account" className={({ isActive, isPending }) =>
                                isPending ? "pending" : isActive ? "active" : ""
                    }>Konto</NavLink></li>
                    <li><NavLink to="/about" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                    }>O nas</NavLink></li>
                    <li><NavLink to="/contact" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                    }>Kontakt</NavLink></li>
                    <li><NavLink to="/ShoppingCart" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                    }>
                        600,92 <span className="currency">zł</span>
                            {/* Zrób obramowanie, i before'a tak żeby wyglądało to na ikonkę koszyka */}
                        <div className="sub-cathegories-wrapper">
                            <div className="sub-cathegories">
                            {/* Zrób by był slider, gridem do ogarnięcia ig i max-heightem*/}
                            <ol className="sub-cathegories-listed-items">
                                {/* <li>PRODUCT COMPONENT</li> */}
                            </ol>
                            <div className="sub-cathegories-sum"><b>Kwota:</b> 600,92 <span className="currency">zł</span></div>
                            <NavLink to="/ShoppingCart"><button>Zobacz Koszyk</button></NavLink>
                            <NavLink to="/Checkout"><button>Zamów</button></NavLink>
                            </div>
                            {/* LUB BRAK PRODUKTÓW W KOSZYKU */}
                        </div>
                    </NavLink></li>
                </ol>
            </nav>
        </header>
    )
}