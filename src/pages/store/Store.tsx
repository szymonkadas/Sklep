import { useLoaderData } from "react-router"
import { CollectionData, getProductsData } from "../../api"
import { createLoaderFunction } from "../../utils/createLoaderFunction"
interface LoaderData {
    products: CollectionData
}

export const storeLoader = await createLoaderFunction([{key: "products", fetcher: getProductsData}], "storeData")

export default function Store(){
    const data = useLoaderData() as LoaderData;
    console.log(data);
    return(
        <>
        </>
    )
}