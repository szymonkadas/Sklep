import { useMemo } from "react"
import Searchbar from "../../components/Store/Searchbar"
import { arrayData, product } from "./StoreLayout"
// import PriceSetter from "../../components/Store/PriceSetter"
import CathegoriesFilter from "../../components/Store/CathegoriesFilter"
import PriceSetter, { priceRange } from "../../components/Store/PriceSetter"

export type storeAsideProps = {
    searchVal: string,
    setSearchVal: React.Dispatch<React.SetStateAction<string>>
    currentCathegory: string,
    setCurrentCathegory: React.Dispatch<React.SetStateAction<string>>,
    filteredProducts: arrayData,
    usersPriceRange: priceRange,
    setUsersPriceRange: React.Dispatch<React.SetStateAction<priceRange>>
    clearFilters: () => void
}
//product namesy tutaj liczyć.
const StoreAside = function(props:storeAsideProps){
    const productNames = useMemo(()=>createProductNames(props.filteredProducts), [props.filteredProducts])
    return(
        <aside className="store-aside">
            <button onClick={()=>props.clearFilters()}>Clear filters</button>     
            <Searchbar productNames={productNames} setSearchVal={props.setSearchVal}></Searchbar>
            <PriceSetter usersPriceRange={props.usersPriceRange} setUsersPriceRange={props.setUsersPriceRange}></PriceSetter>
            <CathegoriesFilter setCurrentCathegory={props.setCurrentCathegory}></CathegoriesFilter>   
        </aside>
    )

}
function createProductNames(data: any){
    return data.map((product:product) => {
        return product.data.name 
    })
}

export default StoreAside;