import { ChangeEvent, FC, useCallback, useState } from 'react';
interface SearchbarProps{
    usersPriceRange: priceRange,
    setUsersPriceRange: React.Dispatch<React.SetStateAction<priceRange>>
}
export type priceRange = {
    maxPrice: number,
    minPrice: number;
}
//potential tweaks: if i change price inputs with html interface, it's value is integer, not float.
// also the price could be instead of transitioning from "," to "." because of toFixed, would maintain "," as a separator
//There's one currency meant to be, so i'll just give it hard coded pln
const PriceSetter: FC<SearchbarProps> = (props: SearchbarProps)=>{
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const [priceRangeValidity, setPriceRangeValidity] = useState(true);
    const maxInputPrice = 99999.99;
    const pricePattern = /^\d{0,5}([.,]\d+)?$/; //only values in range <0; maxInputPrice> and "";
    const incorrectPriceRangeClass = priceRangeValidity ? "" : "store-aside__price-filter__input--incorrect"
    const submitUsersPriceRange = ()=>{
        checkPriceRangeValidity(min, max)
        if(priceRangeValidity){
            const minimum = min ? parseFloat(min) : 0.00
            const maximum = max ? parseFloat(max) : props.usersPriceRange.maxPrice
            props.setUsersPriceRange({minPrice: minimum, maxPrice: maximum})
        }
        return
    }

    const checkPriceRangeValidity = useCallback((min:string, max:string)=>{
        if(!pricePattern.test(max) || !pricePattern.test(min)){
            setPriceRangeValidity(false)
        }else{
            setPriceRangeValidity(true)
            if(min !== ""){
                if(max !== ""){
                    let minimum: number = parseFloat(min);
                    let maximum: number = parseFloat(max);
                    if(parseFloat(min) > parseFloat(max)){
                        setMin(maximum.toFixed(2));
                        setMax(minimum.toFixed(2));
                    }else{
                        setMin(minimum.toFixed(2));
                        setMax(maximum.toFixed(2));
                    }
                }else{
                    setMin(parseFloat(min).toFixed(2));
                    setMax("");
                }
            }else if(max === ""){
                setMin("");
                setMax("");
            }else{
                setMin("");
                setMax(parseFloat(max).toFixed(2));
            }
        }
    }, [])

    const handleFinishedChanges = (event: ChangeEvent<HTMLInputElement>) => {
        checkPriceRangeValidity(min, max)
    }

    return(
        <div className="store-aside__price-filter-layout">
            <h4>Filter by price</h4>
            <div className="store-aside__price-filter">
                <input key="priceSetterMin" 
                    className={`store-aside__price-filter__input ${incorrectPriceRangeClass}`} 
                    type="text" 
                    value={min} 
                    onChange={(event)=> setMin(event.target.value)} 
                    onBlur={(event)=>handleFinishedChanges(event)} 
                    placeholder='od'>
                </input>
                <span  className="store-aside__price-filter__input-divider" > - </span>
                <input key="priceSetterMax" 
                    className={`store-aside__price-filter__input ${incorrectPriceRangeClass}`} 
                    type="text" 
                    value={max} 
                    onChange={(event)=> setMax(event.target.value)} 
                    onBlur={(event)=>handleFinishedChanges(event)} 
                    placeholder='do'>
                </input>
            </div>
            <div className="store-aside__price-filter__interface-button">
                <span>{props.usersPriceRange.minPrice}</span>
                <input type="range" 
                    min={props.usersPriceRange.minPrice} 
                    max={props.usersPriceRange.maxPrice} 
                    step="1"
                    value={max}
                    onChange={(event)=>setMax(event.target.value)}
                    >
                </input>
                <span>{props.usersPriceRange.maxPrice}</span>
            </div>
            <button className="store-aside__price-filter__interface-button" 
                onClick={()=>submitUsersPriceRange()}>Search
            </button> 
        </div>
    )
}

export default PriceSetter;

