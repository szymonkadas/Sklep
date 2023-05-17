import { FC, Suspense, createContext, lazy, useMemo, useState } from "react";
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
export type fetchedProductData = {
    data: productData,
    id: string
}

export const storeLoader = await createLoaderFunction([{key: "products", fetcher: getProductsData}, {key: "cathegories", fetcher: getCathegoriesData}], "storeData");

type StoreData = {
    products: arrayData,
    cathegories: storeDisplayCathegory[]
}
export const StoreData = createContext<StoreData>({
    products: {},
    cathegories: [{cathegoryName: "all", differentProductsCount: 0}]
});

const StoreLayout: FC = function(){
try{
    const data = useLoaderData() as LoaderData;
    if(!data) throw("Błąd fetcha");
    
    const [searchVal, setSearchVal] = useState("");
    const [currentCathegory, setCurrentCathegory] = useState("");
    const [usersPriceRange, setUsersPriceRange] =  useState(getPriceRange(data.products.collectionData));
    const filteredProducts: arrayData = useMemo(()=>filterProducts(data.products.collectionData, searchVal, currentCathegory, usersPriceRange), [searchVal, currentCathegory, usersPriceRange])
    const cathegories: storeDisplayCathegory[] = useMemo(()=>getCathegoriesDataForDisplay(data.cathegories.collectionData, data.products.collectionData), [searchVal]);
    
    const clearFilters = ()=>{
        setSearchVal("");
        setCurrentCathegory("");
        setUsersPriceRange(getPriceRange(data.products.collectionData))
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
    
    return(
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <StoreData.Provider value={{products: data.products.collectionData, cathegories}}>
                    <StoreAside {...StoreAsideProps}></StoreAside>
                </StoreData.Provider>
            </Suspense>
            <Outlet context={filteredProducts}/>
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

export function filterProducts(data: arrayData , searchVal?: string, cathegory?: string, priceRange?: priceRange){
    let result = JSON.parse(JSON.stringify(data));
    if(searchVal !== undefined){
        result = result.filter((product:productData) => product.name.toLowerCase().includes(searchVal))
    }if(cathegory !== undefined && cathegory.length > 0){
        result = result.filter((product:productData) => product.cathegory === cathegory)
    }if(priceRange !== undefined){
        result = result.filter((product:productData) => {
            if(product.discount && product.discount_price){
                if(product.discount_price >= priceRange.minPrice 
                && product.discount_price <= priceRange.maxPrice){
                    return product
                }
            }else if(product.price){
                if(product.price >= priceRange.minPrice 
                && product.price <= priceRange.maxPrice){
                    return product
                }
            }
        })
    }
    return result;
}

function getCathegoriesDataForDisplay(cathegories: arrayData, productsData: arrayData):storeDisplayCathegory[]{
    let cathegoriesDataCopy: arrayData[] = JSON.parse(JSON.stringify(cathegories));
    const cathegoriesNames = cathegoriesDataCopy.map((cathegory:any)=>{
        return cathegory.data.cathegory
    })
    return countProductsPerCathegory(cathegoriesNames, productsData)
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

export function countProductsPerCathegory(cathegories: arrayData, productsData: arrayData):storeDisplayCathegory[]{
    return cathegories.map((cathegoryName: string)=>{
       return countProducts(productsData, cathegoryName)
    })
}

export function getPriceRange(productsData: arrayData, cathegory: string | false = false):priceRange{
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
        return {maxPrice: result.maxPrice, minPrice: result.maxPrice}
    }
    return result
}

export default StoreLayout