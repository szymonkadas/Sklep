import { FC, useContext } from "react";
import { StoreData } from "../../pages/store/StoreLayout";
export interface storeDisplayCathegory{
    cathegoryName: string,
    differentProductsCount: number,
}
interface cathegoriesProps{
    setCurrentCathegory: React.Dispatch<React.SetStateAction<string>>
}

const CathegoriesFilter: FC<cathegoriesProps> = (props)=>{
    let productsCount = 0;
    const cathegories = useContext(StoreData).cathegories.map(cathegory => {
        productsCount += cathegory.differentProductsCount;
        return <li className="store-aside__cathegories-filter__listing">
            <a href="javascript:void(0);" className="store-aside__cathegories-filter__listing__link"
                onClick={()=>props.setCurrentCathegory(cathegory.cathegoryName)}>
                {cathegory.cathegoryName}
            </a>
            <span className="store-aside__cathegories-filter__listing__products-count">({cathegory.differentProductsCount})</span>
        </li>
    })
    return(
        <div className="store-aside__cathegories-filter">
            <h4>Browse by cathegories</h4>
            <ul className="store-aside__cathegories-filter__list">
                <li className="store-aside__cathegories-filter__listing">
                    <a href="javascript:void(0);" className="store-aside__cathegories-filter__listing__link"
                        onClick={()=>props.setCurrentCathegory("")}>
                        all
                    </a>
                    <span className="store-aside__cathegories-filter__listing__products-count">({productsCount})</span>
                </li>
                {...cathegories}
            </ul>
        </div>  
    )
}
export default CathegoriesFilter;