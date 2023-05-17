import { useContext, useMemo } from "react"
import { productData } from "../../api"
import CathegoriesFilter from "../../components/Store/CathegoriesFilter"
import PriceSetter, { priceRange } from "../../components/Store/PriceSetter"
import Searchbar from "../../components/Store/Searchbar"
import { StoreData, arrayData, fetchedProductData, filterProducts } from "./StoreLayout"
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
    // const productNames = useMemo(()=>createProductNames(props.filteredProducts), [props.filteredProducts, props.searchVal, props.currentCathegory])
    const products = useContext(StoreData).products;
    const searchbarFilteredNames = useMemo(()=>createProductNames(filterProducts(products, undefined, props.currentCathegory, props.usersPriceRange )), [props.filteredProducts, props.searchVal])
    const filteredCathegoriesProductMap = new Map<string, number>();
    props.filteredProducts.forEach((product: fetchedProductData) => {
        if(filteredCathegoriesProductMap.has(product.data.cathegory)){
            filteredCathegoriesProductMap.set(
                product.data.cathegory, 
                filteredCathegoriesProductMap.get(product.data.cathegory)! + 1
                // ! so typescript believes me that it is indeed not undefined.
            );
        }else{
            filteredCathegoriesProductMap.set(product.data.cathegory, 1)
        }
    })
    return(
        <aside className="store-aside">
            <button onClick={()=>props.clearFilters()}>Clear filters</button>     
            <Searchbar productNames={searchbarFilteredNames} searchVal={props.searchVal} setSearchVal={props.setSearchVal}></Searchbar>
            <PriceSetter usersPriceRange={props.usersPriceRange} setUsersPriceRange={props.setUsersPriceRange}></PriceSetter>
            <CathegoriesFilter filteredCathegoriesProductMap={filteredCathegoriesProductMap} setCurrentCathegory={props.setCurrentCathegory}></CathegoriesFilter>   
        </aside>
    )

}
function createProductNames(data: any){
    return data.map((product:productData) => {
        return product.name 
    })
}

export default StoreAside;