import { FC, Suspense, lazy, useMemo, useState } from "react";
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

const StoreLayout: FC = function(){
try{
    const data = useLoaderData() as LoaderData;
    if(!data){
        throw("Błąd fetcha")
    }
    // console.log(data);
    const [searchVal, setSearchVal] = useState("");
    const [currentCathegory, setCathegory] = useState("");
    const priceRange:priceRange = useMemo(()=>getPriceRange(data.products.collectionData), []);
    const [filteredProducts, setFilteredProducts] = useState(filterProducts(data.products.collectionData, searchVal, currentCathegory))
    const [cathegories, setCathegories] = useState(getCathegoriesDataForDisplay(data.cathegories.collectionData, data.products.collectionData));
    const [currentPriceRange, setCurrentPriceRange] =  useState(priceRange);
    const StoreAsideProps: storeAsideProps = {
        searchVal,
        setSearchVal,
        currentCathegory,
        setCathegory,
        filteredProducts,
        cathegories,
        priceRange,
        currentPriceRange,
        setCurrentPriceRange,
    }
    return(
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <StoreAside {...StoreAsideProps}></StoreAside>
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

function getCathegoriesDataForDisplay(data: arrayData, originalProductsData: arrayData):storeDisplayCathegory[]{
    return countDifferentProducts(getCathegoriesNames(data), originalProductsData)
}

function getCathegoriesNames(data: arrayData):string[]{
    let dataCopy:arrayData[] = JSON.parse(JSON.stringify(data));
    return dataCopy.map((cathegory:any)=>{
        return cathegory.data.cathegory
    })
}

function countDifferentProducts(data: arrayData, originalProductsData: arrayData):storeDisplayCathegory[]{
    let dataCopy = JSON.parse(JSON.stringify(data));
    return dataCopy.map((cathegoryName: string)=>{
        return originalProductsData.reduce((accumulator: storeDisplayCathegory , currVal: fetchedProductData)=>{
            if(currVal.data.cathegory.toLowerCase() === cathegoryName.toLowerCase()){
                return {
                    ...accumulator, 
                    differentProductsCount: accumulator.differentProductsCount + 1
                }
            }
            return accumulator;
        }, {cathegoryName, differentProductsCount: 0})
    })
}

function getPriceRange(originalProductsData: arrayData):priceRange{
    let dataCopy = JSON.parse(JSON.stringify(originalProductsData));
    return dataCopy.reduce((accumulator: priceRange, currVal: fetchedProductData, index: number, arrayData: arrayData)=>{
        if(currVal.data.discount && currVal.data.discount_price){
            //First iteration case
            if(accumulator.minPrice === null){
                accumulator.minPrice = currVal.data.discount_price
            }
            const minPrice = accumulator.minPrice > currVal.data.discount_price ? currVal.data.discount_price : accumulator.minPrice;
            const maxPrice = accumulator.maxPrice < currVal.data.discount_price ? currVal.data.discount_price : accumulator.maxPrice;
            return {
                minPrice,
                maxPrice
            }
        }else if(currVal.data.price){
            if(accumulator.minPrice === null){
                accumulator.minPrice = currVal.data.price
            }
            const minPrice = accumulator.minPrice > currVal.data.price ? currVal.data.price : accumulator.minPrice;
            const maxPrice = accumulator.maxPrice < currVal.data.price ? currVal.data.price : accumulator.maxPrice;
            return {
                minPrice,
                maxPrice
            }
        }else{
            if(index == arrayData.length){
                let minPrice = accumulator.minPrice
                let maxPrice = accumulator.maxPrice
                if(minPrice === null){
                    minPrice = 0;
                }
                if(maxPrice === null){
                    maxPrice = 0;
                }
                return{
                    minPrice, 
                    maxPrice
                }
            }
            return accumulator;
        }
    }, {maxPrice: null, minPrice: null})
    // return dataCopy.reduce(())
}

export default StoreLayout