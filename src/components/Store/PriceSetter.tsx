import { ChangeEvent, FC, useCallback, useState } from 'react';

interface SearchbarProps{
    priceRange: priceRange,
    currentPriceRange: priceRange,
    setCurrentPriceRange: React.Dispatch<React.SetStateAction<priceRange>>
}
export type priceRange = {
    maxPrice: number,
    minPrice: number;
}
//potential tweaks: if i change price inputs with html interface, it's value is integer, not float.
// also the price could be instead of transitioning from "," to "." because of toFixed, would maintain "," as a separator
//There's one currency meant to be, so i'll just give it hard coded pln
const PriceSetter: FC<SearchbarProps> = (props: SearchbarProps)=>{
    const [min, setMin] = useState(props.currentPriceRange.minPrice.toFixed(2));
    const [max, setMax] = useState(props.currentPriceRange.maxPrice.toFixed(2));
    const [priceRangeValidity, setPriceRangeValidity] = useState(true);

    const maxInputPrice = 99999999;
    const pricePattern = /^\d+([.,]\d+)?$/
    //visualiser style
    const visualiserWidth = props.priceRange.maxPrice - props.priceRange.minPrice;
    const paddLeft = (parseFloat(min) - props.priceRange.minPrice)/visualiserWidth;
    const paddRight = (props.priceRange.maxPrice - parseFloat(max))/visualiserWidth;
    const visualiserStyle = { 
        padding: `0, ${paddRight}%, 0, ${paddLeft}%`
    }
    const incorrectPriceRangeClass = priceRangeValidity ? "" : "store-aside__price-filter__input--incorrect"
    
    const submitPriceRange = ()=>{
        checkPriceRangeValidity(min, max)
        if(priceRangeValidity){
            props.setCurrentPriceRange({minPrice: parseFloat(min), maxPrice:parseFloat(max)})
        }
        return
    }
    const checkPriceRangeValidity = useCallback((min:string, max:string)=>{
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
                    placeholder='min'>
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
                    placeholder='max'>
                </input>
            </div>
            <div className="store-aside__price-filter__interface">
                <div className="store-aside__price-filter__interface__visualiser" 
                    style={visualiserStyle}>
                </div>
                <button className="store-aside__price-filter__interface__button" 
                    onClick={()=>submitPriceRange()}>Search
                </button> 
                <span className="store-aside__price-filter__interface__text">
                    Cena: 
                        <b>{props.currentPriceRange.minPrice.toFixed(2)} zł</b> 
                        -   
                        <b>{props.currentPriceRange.maxPrice.toFixed(2)} zł</b>
                </span>
            </div>
        </div>
    )
}

export default PriceSetter;

