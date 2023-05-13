import { useMemo } from "react"
import { storeDisplayCathegory } from "../../components/Store/CathegoriesFilter"
import Searchbar from "../../components/Store/Searchbar"
import { arrayData, product } from "./StoreLayout"
// import PriceSetter from "../../components/Store/PriceSetter"
import CathegoriesFilter from "../../components/Store/CathegoriesFilter"
import PriceSetter, { priceRange } from "../../components/Store/PriceSetter"


export type storeAsideProps = {
    searchVal: string,
    setSearchVal: React.Dispatch<React.SetStateAction<string>>
    currentCathegory: string,
    setCathegory: React.Dispatch<React.SetStateAction<string>>,
    filteredProducts: arrayData,
    cathegories: storeDisplayCathegory[],
    priceRange: priceRange,
    currentPriceRange: priceRange,
    setCurrentPriceRange: React.Dispatch<React.SetStateAction<priceRange>>
}
//product namesy tutaj liczyć.
const StoreAside = function(props:storeAsideProps){
    const productNames = useMemo(()=>createProductNames(props.filteredProducts), [props.searchVal, props.currentCathegory])

    return(
        <aside className="store-aside">
            <Searchbar productNames={productNames} setSearchVal={props.setSearchVal}></Searchbar>
            <PriceSetter priceRange={props.priceRange} currentPriceRange={props.currentPriceRange} setCurrentPriceRange={props.setCurrentPriceRange}></PriceSetter>
             <CathegoriesFilter cathegories={props.cathegories} setCathegory={props.setCathegory}></CathegoriesFilter>
        </aside>
    )

}
function createProductNames(data: any){
    return data.map((product:product) => {
        return product.data.name 
    })
}

export default StoreAside;