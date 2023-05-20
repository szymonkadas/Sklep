import CathegoriesFilter from "../../components/Store/CathegoriesFilter"
import PriceSetter, { priceRange } from "../../components/Store/PriceSetter"
import Searchbar from "../../components/Store/Searchbar"
import { arrayData, fetchedProductData } from "./StoreLayout"
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
const StoreAside = function(props:storeAsideProps){
    const filteredCathegoriesProductMap = new Map<string, number>();
    props.filteredProducts.forEach((product: fetchedProductData) => {
        if(filteredCathegoriesProductMap.has(product.data.cathegory)){
            filteredCathegoriesProductMap.set(
                product.data.cathegory, 
                filteredCathegoriesProductMap.get(product.data.cathegory)! + 1
                // using ! so typescript believes me that it is indeed not undefined.
            );
        }else{
            filteredCathegoriesProductMap.set(product.data.cathegory, 1)
        }
    })

    return(
        <aside className="store-aside">
            <button onClick={()=>props.clearFilters()}>Clear filters</button>     
            <Searchbar searchVal={props.searchVal} setSearchVal={props.setSearchVal} currentCathegory={props.currentCathegory} setCurrentCathegory={props.setCurrentCathegory} usersPriceRange={props.usersPriceRange}></Searchbar>
            <PriceSetter usersPriceRange={props.usersPriceRange} setUsersPriceRange={props.setUsersPriceRange} currentCathegory={props.currentCathegory}></PriceSetter>
            <CathegoriesFilter filteredCathegoriesProductMap={filteredCathegoriesProductMap} setCurrentCathegory={props.setCurrentCathegory}></CathegoriesFilter>   
        </aside>
    )

}

export default StoreAside;