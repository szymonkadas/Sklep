import { LoaderFunction } from "react-router";
import { CollectionData, DocData } from "../api";
interface dataKeys{
    key: string, 
    fetcher: ()=>Promise<CollectionData | DocData>
}

export async function createLoaderFunction(dataKeys: dataKeys[], localStorageKey: string){
    const loader: LoaderFunction = async({params, request})=>{
    //this localstorage is created purely of need to decrease api requests which are limited.
        const storeData = localStorage.getItem(localStorageKey)
        if(storeData){
            const data: any = JSON.parse(storeData)
            return dataKeys.reduce((prevVal, currVal)=>{
                return {
                    ...prevVal,
                    [currVal.key]: data[currVal.key]
                }
            }, {})
        }else{
            async function fetchData(dataKeys: dataKeys[]) {
                const entries = await Promise.all(
                    dataKeys.map(async (dataKey) => {
                    const value = await dataKey.fetcher();
                    console.log(value)
                    return [dataKey.key, value];
                    })
                );
              return Object.fromEntries(entries);
            }
            console.log("API Request", localStorageKey)
            const data: any = await fetchData(dataKeys)
            localStorage.setItem(localStorageKey, JSON.stringify(data))
            return data;
        }       
    } 
    return loader
}