import { FC, useContext } from "react";
import { StoreData } from "../../pages/store/StoreLayout";
export interface storeDisplayCathegory{
    cathegoryName: string,
    differentProductsCount: number,
}
interface cathegoriesProps{
    setCurrentCathegory: React.Dispatch<React.SetStateAction<string>>
    filteredCathegoriesProductMap: Map<string, number>
}

const CathegoriesFilter: FC<cathegoriesProps> = (props)=>{
    const allCathegoriesSelector = useContext(StoreData).allCathegoriesSelector
    let filteredProductsSum = 0;
    const cathegories = useContext(StoreData).cathegories.map(cathegory => {
        let filteredProductsCount = 0
        if(props.filteredCathegoriesProductMap.has(cathegory.cathegoryName)){
            filteredProductsCount = props.filteredCathegoriesProductMap.get(cathegory.cathegoryName)!
        }
        filteredProductsSum += filteredProductsCount;
        return <li className="store-aside__cathegories-filter__listing">
            <a href="javascript:void(0);" className="store-aside__cathegories-filter__listing__link"
                onClick={()=>props.setCurrentCathegory(cathegory.cathegoryName)}>
                {cathegory.cathegoryName}
            </a>
            <span className="store-aside__cathegories-filter__listing__products-count">(<b>{filteredProductsCount}</b>/{cathegory.differentProductsCount})</span>
        </li>
    })
    return(
        <div className="store-aside__cathegories-filter">
            <h4>Browse by cathegories</h4>
            <ul className="store-aside__cathegories-filter__list">
                <li className="store-aside__cathegories-filter__listing">
                    <a href="javascript:void(0);" className="store-aside__cathegories-filter__listing__link"
                        onClick={()=>props.setCurrentCathegory("")}>
                        {allCathegoriesSelector.cathegoryName}
                    </a>
                    <span className="store-aside__cathegories-filter__listing__products-count">(<b>{filteredProductsSum}</b>/{allCathegoriesSelector.differentProductsCount})</span>
                </li>
                {...cathegories}
            </ul>
        </div>  
    )
}
export default CathegoriesFilter;