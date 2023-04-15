import { NavLink } from "react-router-dom";
import footer from "../style/components/css/Footer.module.css";
import "../style/components/css/Header.css";
export default function Footer(){
    return(
        <footer className={footer["footer"]}>
            <ol className={footer["footer__nav-links"]}>
                <li className="nav-links__li"><NavLink to="/" className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                }>Strona Główna </NavLink></li>
                <li className="nav-links__li"><NavLink to="/store" className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                }>
                    Sklep 
                </NavLink></li>
                <li className="nav-links__li"><NavLink to="/store/accesories" className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
                }>Akcesoria</NavLink></li>
                <li className="nav-links__li"><NavLink to="/store/man" className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                }>Dla niego</NavLink></li>
                <li className="nav-links__li"><NavLink to="/store/woman" className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                }>Dla niej</NavLink></li>
                <li className="nav-links__li"><NavLink to="/account" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                }>Konto</NavLink></li>
                <li className="nav-links__li"><NavLink to="/about" className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                }>O nas</NavLink></li>
                <li className="nav-links__li"><NavLink to="/contact" className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                }>Kontakt</NavLink></li>
                <li className="nav-links__li"><NavLink to="/ShoppingCart" className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                }>Koszyk
                </NavLink></li>
            </ol>     
            <div className={footer["footer__sub-footer"]}>
                <p>Copyright © 2023 Twoja Firma</p>    
                <p>Autor: Szymon Kadaś</p>
            </div>       
        </footer>
    )
}