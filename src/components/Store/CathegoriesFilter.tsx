import { FC } from "react";
export interface storeDisplayCathegory{
    cathegoryName: string,
    differentProductsCount: number,
}
interface cathegoriesProps{
    cathegories: storeDisplayCathegory[];
    setCathegory: React.Dispatch<React.SetStateAction<string>>
}

const CathegoriesFilter: FC<cathegoriesProps> = (props)=>{
    const cathegories = props.cathegories.map(cathegory => {
        return <li className="store-aside__cathegories-filter__listing">
            <a className="store-aside__cathegories-filter__listing__link"
                onClick={()=>props.setCathegory(cathegory.cathegoryName)}>
                {cathegory.cathegoryName}
            </a>
            <span className="store-aside__cathegories-filter__listing__products-count">({cathegory.differentProductsCount})</span>
        </li>
    })
    return(
        <div className="store-aside__cathegories-filter">
            <h4>Browse by cathegories</h4>
            <ul className="store-aside__cathegories-filter__list">
                {...cathegories}
            </ul>
        </div>  
    )
}
export default CathegoriesFilter;