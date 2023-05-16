import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from 'react';
import { StoreData } from '../../pages/store/StoreLayout';
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
    const [min, setMin] = useState(props.usersPriceRange.minPrice.toFixed(2));
    const [max, setMax] = useState(props.usersPriceRange.maxPrice.toFixed(2));
    const [priceRangeValidity, setPriceRangeValidity] = useState(true);
    const priceRange = useContext(StoreData).priceRange;
    //I have no idea why do i have to use useEffect, but without this, state won't change on props update FROM OUTSIDE!.
    useEffect(()=>{
        setMin(props.usersPriceRange.minPrice.toFixed(2));
        setMax(props.usersPriceRange.maxPrice.toFixed(2));
    }, [props])
    const maxInputPrice = 99999999;
    const pricePattern = /^\d+([.,]\d+)?$/
    //visualiser style
    const visualiserWidth = priceRange.maxPrice - priceRange.minPrice;
    const paddLeft = (parseFloat(min) - priceRange.minPrice)/visualiserWidth;
    const paddRight = (priceRange.maxPrice - parseFloat(max))/visualiserWidth;
    const visualiserStyle = { 
        padding: `0, ${paddRight}%, 0, ${paddLeft}%`
    }
    const incorrectPriceRangeClass = priceRangeValidity ? "" : "store-aside__price-filter__input--incorrect"
    
    const submitUsersPriceRange = ()=>{
        checkPriceRangeValidity(min, max)
        if(priceRangeValidity){
            props.setUsersPriceRange({minPrice: parseFloat(min), maxPrice:parseFloat(max)})
        }
        return
    }
    const checkPriceRangeValidity = useCallback((min:string, max:string)=>{
        max = max === "" ? priceRange.maxPrice.toFixed(2) : max;
        min = min === "" ? priceRange.minPrice.toFixed(2) : min;
        if(!pricePattern.test(max) || !pricePattern.test(min)){
            setPriceRangeValidity(false)
        }else{
            setPriceRangeValidity(true)
            let minimum: number = parseFloat(min)
            let maximum: number = parseFloat(max)
            if(minimum > maxInputPrice){
                setMin(maxInputPrice.toFixed(2))
                setMax(maxInputPrice.toFixed(2))
            }else if(maximum > maxInputPrice){
                setMin(minimum.toFixed(2))
                setMax(maxInputPrice.toFixed(2))
            }else if(parseFloat(min) > parseFloat(max)){
                setMin(maximum.toFixed(2))
                setMax(minimum.toFixed(2))
            }else{
                setMin(minimum.toFixed(2))
                setMax(maximum.toFixed(2))
            }
        }
    }, [])

    const handlePriceChange = (event: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>)=>{
        if(event.target.value !== null){
            setter(event.target.value)
        }else{
            setter("0")
        }
    }

    const handleFinishedChanges = (event: ChangeEvent<HTMLInputElement>) => {
        checkPriceRangeValidity(min, max)
    }

    return(
        <div className="store-aside__price-filter-layout">
            <h4>Filter by price</h4>
            <div className="store-aside__price-filter">
                <input key="priceSetterMin" 
                    className={`store-aside__price-filter__input ${incorrectPriceRangeClass}`} 
                    type="number" 
                    max={`${maxInputPrice}`} 
                    min={0}
                    value={min} 
                    onChange={(event)=>handlePriceChange(event, setMin)} 
                    onBlur={(event)=>handleFinishedChanges(event)} 
                    placeholder='od'>
                </input>
                <span  className="store-aside__price-filter__input-divider" > - </span>Price
                <input key="priceSetterMax" 
                    className={`store-aside__price-filter__input ${incorrectPriceRangeClass}`} 
                    type="number" 
                    max={`${maxInputPrice}`} 
                    min={0} 
                    value={max} 
                    onChange={(event)=>handlePriceChange(event, setMax)} 
                    onBlur={(event)=>handleFinishedChanges(event)} 
                    placeholder='do'>
                </input>
            </div>
            <div className="store-aside__price-filter__interface">
                <div className="store-aside__price-filter__interface__visualiser" 
                    style={visualiserStyle}>
                </div>
                <button className="store-aside__price-filter__interface__button" 
                    onClick={()=>submitUsersPriceRange()}>Search
                </button> 
                <span className="store-aside__price-filter__interface__text">
                    Cena: 
                        <b>{props.usersPriceRange.minPrice.toFixed(2)} zł</b> 
                        -   
                        <b>{props.usersPriceRange.maxPrice.toFixed(2)} zł</b>
                </span>
            </div>
        </div>
    )
}

export default PriceSetter;

