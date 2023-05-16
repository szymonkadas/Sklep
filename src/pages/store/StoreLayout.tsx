import { FC, Suspense, createContext, lazy, useEffect, useMemo, useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import { CollectionData, getCathegoriesData, getProductsData, productData } from "../../api";
import { storeDisplayCathegory } from "../../components/Store/CathegoriesFilter";
import { priceRange } from "../../components/Store/PriceSetter";
import { createLoaderFunction } from "../../utils/createLoaderFunction";
import { storeAsideProps } from "./StoreAside";
// import StoreAside from "./StoreAside";
const StoreAside = lazy(()=> import("./StoreAside"));

interface LoaderData {
    products: CollectionData,
    cathegories: CollectionData
}
export type arrayData = {
    [key: string]: any
}
export type product = {
    data: productData;
}
type fetchedProductData = {
    data: productData,
    id: string
}

export const storeLoader = await createLoaderFunction([{key: "products", fetcher: getProductsData}, {key: "cathegories", fetcher: getCathegoriesData}], "storeData");

type StoreData = {
    priceRange: priceRange,
    cathegories: storeDisplayCathegory[],
    productsCount: number
}
export const StoreData = createContext<StoreData>({
    priceRange: {maxPrice: 0, minPrice: 0},
    cathegories: [{cathegoryName: "all", differentProductsCount: 0}],
    productsCount: 0
});

const StoreLayout: FC = function(){
try{
    const data = useLoaderData() as LoaderData;
    if(!data){
        throw("Błąd fetcha")
    }
    const [searchVal, setSearchVal] = useState("");
    const [currentCathegory, setCurrentCathegory] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(filterProducts(data.products.collectionData))
    const priceRange:priceRange = useMemo(() => getPriceRange(data.products.collectionData, currentCathegory), [currentCathegory, filteredProducts]);
    const cathegories:storeDisplayCathegory[] = useMemo(()=>getCathegoriesDataForDisplay(data.cathegories.collectionData, data.products.collectionData), []);
    const productsCount:number = useMemo(()=> countProducts(filteredProducts, currentCathegory, searchVal).differentProductsCount, [filteredProducts, currentCathegory, searchVal])
    const [usersPriceRange, setUsersPriceRange] =  useState(priceRange);
    //I know i should use useEffect only for external mechanisms but, this pretty much does all the watching job, like useMemo so...
    useEffect(()=>{
        setUsersPriceRange(priceRange)
    }, [priceRange])
    useEffect(()=>{
        setFilteredProducts(filterProducts(data.products.collectionData, searchVal, currentCathegory))
    }, [searchVal, currentCathegory])
    
    const clearFilters = ()=>{
        setSearchVal("");
        setCurrentCathegory("");
        setFilteredProducts(data.products.collectionData);
        setUsersPriceRange(priceRange);
    }
    const StoreAsideProps: storeAsideProps = {
        searchVal,
        setSearchVal,
        currentCathegory,
        setCurrentCathegory,
        filteredProducts,
        usersPriceRange,
        setUsersPriceRange,
        clearFilters
    }
    // console.log(currentCathegory, priceRange, usersPriceRange, productsCount);
    return(
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <StoreData.Provider value={{priceRange, cathegories, productsCount}}>
                    <StoreAside {...StoreAsideProps}></StoreAside>
                </StoreData.Provider>
            </Suspense>
            <Outlet/>
        </>
    )
}catch(error){
    console.log(error)
    return(
        <div className="store-layout__error">
        Wystąpił błąd w połączeniu
        </div>
    )
}
}

function filterProducts(data: arrayData , searchVal?: string, cathegory?: string, priceRange?: priceRange){
    let result = JSON.parse(JSON.stringify(data));
    if(searchVal !== undefined){
        result = result.filter((product:product) => product.data.name.toLowerCase().includes(searchVal))
    }if(cathegory !== undefined && cathegory.length > 0){
        result = result.filter((product:product) => product.data.cathegory === cathegory)
    }if(priceRange !== undefined){
        result = result.filter((product:product) => {
            if(product.data.discount && product.data.discount_price){
                if(product.data.discount_price >= priceRange.minPrice 
                && product.data.discount_price <= priceRange.maxPrice){
                    return product
                }
            }else if(product.data.price){
                if(product.data.price >= priceRange.minPrice 
                && product.data.price <= priceRange.maxPrice){
                    return product
                }
            }
        })
    }
    return result;
}

function getCathegoriesDataForDisplay(cathegories: arrayData, productsData: arrayData):storeDisplayCathegory[]{
    return countDifferentProducts(getCathegoriesNames(cathegories), productsData)
}

function getCathegoriesNames(data: arrayData):string[]{
    let dataCopy:arrayData[] = JSON.parse(JSON.stringify(data));
    return dataCopy.map((cathegory:any)=>{
        return cathegory.data.cathegory
    })
}
function countProducts(data: arrayData, cathegoryName: string | false = false, searchVal: string = ""){
    return data.reduce((accumulator: storeDisplayCathegory , currVal: fetchedProductData)=>{
        if(currVal.data.name.toLowerCase().includes(searchVal)){
            if(cathegoryName && currVal.data.cathegory.toLowerCase() === cathegoryName.toLowerCase() || !cathegoryName){
                return {
                    ...accumulator, 
                    differentProductsCount: accumulator.differentProductsCount + 1
                }
            }
        }
        return accumulator;
    }, {cathegoryName, differentProductsCount: 0})
}
function countDifferentProducts(cathegories: arrayData, productsData: arrayData):storeDisplayCathegory[]{
    const cathegoriesCopy:string[] = JSON.parse(JSON.stringify(cathegories));
    return cathegoriesCopy.map((cathegoryName: string)=>{
       return countProducts(productsData, cathegoryName)
    })
}

function getPriceRange(productsData: arrayData, cathegory: string | false = false):priceRange{
    let dataCopy = JSON.parse(JSON.stringify(productsData));
    const result = dataCopy.reduce((accumulator: priceRange, currVal: fetchedProductData, index: number, arrayData: arrayData)=>{
        if (cathegory && currVal.data.cathegory !== cathegory) return accumulator;
        if(currVal.data.discount && currVal.data.discount_price){
            if(accumulator.minPrice === null) accumulator.minPrice = currVal.data.discount_price;
            const minPrice = accumulator.minPrice > currVal.data.discount_price ? currVal.data.discount_price : accumulator.minPrice;
            const maxPrice = accumulator.maxPrice < currVal.data.discount_price ? currVal.data.discount_price : accumulator.maxPrice;
            return { minPrice, maxPrice }
        }else if(currVal.data.price){
            if(accumulator.minPrice === null) accumulator.minPrice = currVal.data.price;
            const minPrice = accumulator.minPrice > currVal.data.price ? currVal.data.price : accumulator.minPrice;
            const maxPrice = accumulator.maxPrice < currVal.data.price ? currVal.data.price : accumulator.maxPrice;
            return { minPrice, maxPrice }
        }else{
            if(accumulator.minPrice === null) accumulator.minPrice = 0;
            return accumulator
        }
    }, {maxPrice: 0, minPrice: null})
    if (result.minPrice === null) {
        console.log("There was no minimal price value!")
        return {maxPrice: result.maxPrice, minPrice: result.maxPrice}
    }
    return result
}

export default StoreLayout