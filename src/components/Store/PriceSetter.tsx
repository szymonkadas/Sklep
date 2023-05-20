import { ChangeEvent, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StoreData, filterProducts, getPriceRange } from '../../pages/store/StoreLayout';
interface SearchbarProps{
    usersPriceRange: priceRange,
    setUsersPriceRange: React.Dispatch<React.SetStateAction<priceRange>>,
    currentCathegory: string
}
export type priceRange = {
    maxPrice: number,
    minPrice: number;
}
//There's one currency meant to be, so i'll just give it hard coded pln
// This component lets user filter products by price, using 2 inputs and slider (these are connected).
const PriceSetter: FC<SearchbarProps> = (props: SearchbarProps)=>{
    const clearFilters = useContext(StoreData).clearFiltersStatus
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const [userHasSetMaxPrice, setUserHasSetMaxPrice] = useState(false);
    const [userHasSetMinPrice, setUserHasSetMinPrice] = useState(false);
    const [priceRangeValidity, setPriceRangeValidity] = useState(true);
    const products = useContext(StoreData).products;
    const maxPrice = useMemo(()=> getPriceRange(products).maxPrice, [])
    const priceRangeOfCathegory = useMemo(()=>getPriceRange(
        filterProducts(products, undefined, props.currentCathegory)
    ), [props.currentCathegory]);

    useEffect(()=>{if(clearFilters){
        setMin("");
        setMax("");
    }}, [props.usersPriceRange])
    
    const pricePattern = /^\d{0,5}([.,]\d+)?$/; //only values in range <0; maxInputPrice> and "";
    const incorrectPriceRangeClass = priceRangeValidity ? "" : "store-aside__price-filter__input--incorrect";
    
    const submitUsersPriceRange = ()=>{
        checkPriceRangeValidity(min, max)
        if(priceRangeValidity){
            let minimal, maximal;
            if(min){
                minimal = parseFloat(min)
                if(!userHasSetMinPrice) setUserHasSetMinPrice(true)
            }else{
                minimal = priceRangeOfCathegory.minPrice
                if(userHasSetMinPrice) setUserHasSetMinPrice(false);
            }
            if(max){
                maximal = parseFloat(max)
                if(!userHasSetMaxPrice) setUserHasSetMaxPrice(true)
            }else{
                maximal = priceRangeOfCathegory.maxPrice
                if(userHasSetMaxPrice) setUserHasSetMaxPrice(false)
            }
            props.setUsersPriceRange({minPrice: minimal, maxPrice: maximal})
        }
        return;
    };
    const checkPriceRangeValidity = useCallback((min:string, max:string)=>{
        if(!pricePattern.test(max) || !pricePattern.test(min)){
            setPriceRangeValidity(false)
        }else{
            setPriceRangeValidity(true)
            if(min !== ""){
                if(max !== ""){
                    let minimal: number = parseFloat(min);
                    let maximal: number = parseFloat(max);
                    if(parseFloat(min) > parseFloat(max)){
                        setMin(maximal.toFixed(2));
                        setMax(minimal.toFixed(2));
                    }else{
                        setMin(minimal.toFixed(2));
                        setMax(maximal.toFixed(2));
                    }
                    if(!userHasSetMaxPrice) setUserHasSetMaxPrice(true)
                    if(!userHasSetMinPrice) setUserHasSetMinPrice(true)
                }else{
                    setMin(parseFloat(min).toFixed(2));
                    setMax("");
                    if(userHasSetMaxPrice) setUserHasSetMaxPrice(false);
                }
            }else{
                if(max === ""){
                    setMax("");
                    if(userHasSetMaxPrice) setUserHasSetMaxPrice(false);
                }
                setMin("");
                if(userHasSetMinPrice) setUserHasSetMinPrice(false);
            }
        }
    }, [])

    const handleFinishedChanges = (event: ChangeEvent<HTMLInputElement>) => {
        checkPriceRangeValidity(min, max)
    }
    // price slider params calculated by min, max, priceRangeOfCathegory variables
    const priceSlider = useMemo(()=>{
        let minimal = 0
        let presetMin: number = min ? parseFloat(min) : priceRangeOfCathegory.minPrice;
        let maximal = Math.ceil(maxPrice)
        let presetMax: number = max && parseFloat(max) < maximal 
            ? parseFloat(max)
            : priceRangeOfCathegory.maxPrice
        return{ minimal: minimal, presetMin: presetMin, maximal: Math.ceil(maximal), presetMax: Math.ceil(presetMax)}
    }, [min, max, priceRangeOfCathegory]);

    const handleSliderChange = (event: any) =>{
        // had to use inner function cuz couldn't assign such type to event argument ehu.
        function properHandler(event: simpleRangeEvent){
            checkPriceRangeValidity(event.detail.minRangeValue.toFixed(2), event.detail.maxRangeValue.toFixed(2))
        }
        properHandler(event)
    }
    const priceLabelStyle:React.CSSProperties = {
        fontSize: "0px"
    }
    useEffect(()=>window.addEventListener("slider-price-change", handleSliderChange), []);
    return(
        <div className="store-aside__price-filter-layout">
            <h4>Filter by price</h4>
            <div className="store-aside__price-filter">
                {/* min and max labels are for simpleRange inputs id's */}
                <label style={priceLabelStyle} htmlFor="set-min-price">{min}</label>
                <input id="set-min-price" key="priceSetterMin" 
                    className={`store-aside__price-filter__input ${incorrectPriceRangeClass}`} 
                    type="text" 
                    value={min} 
                    onChange={(event)=> setMin(event.target.value)} 
                    onBlur={(event)=> handleFinishedChanges(event)} 
                    placeholder={priceRangeOfCathegory.minPrice.toFixed(2)}>
                </input>
                <span  className="store-aside__price-filter__input-divider" > - </span>
                <label style={priceLabelStyle} htmlFor="max">{max}</label>
                <input name="set-max-price" key="priceSetterMax" 
                    className={`store-aside__price-filter__input ${incorrectPriceRangeClass}`} 
                    type="text" 
                    value={max} 
                    onChange={(event)=> setMax(event.target.value)} 
                    onBlur={(event)=> handleFinishedChanges(event)} 
                    placeholder={priceRangeOfCathegory.maxPrice.toFixed(2)}>
                </input>
                <button className="store-aside__price-filter__interface-button" 
                    onClick={()=>submitUsersPriceRange()}>Search
                </button> 
            </div>
            <div className="store-aside__price-filter__interface-slider">
                {/* https://github.com/maxshuty/accessible-web-components */}
                <range-selector 
                    min-range={priceSlider.minimal}
                    preset-min={priceSlider.presetMin} 
                    max-range={priceSlider.maximal} 
                    preset-max={priceSlider.presetMax}
                    event-name-to-emit-on-change="slider-price-change"
                    hide-label
                    hide-legend
                />
            </div>
 
        </div>
    )
}

export default PriceSetter;

