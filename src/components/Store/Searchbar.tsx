import { ChangeEvent, FC, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
interface SearchbarProps{
    productNames: string[];
    searchVal: string,
    setSearchVal: React.Dispatch<React.SetStateAction<string>>
}
type searchProposal = JSX.Element

const Searchbar: FC<SearchbarProps> = (props: SearchbarProps)=>{
    const [searchbarVal, setSearchbarVal] = useState(props.searchVal)
    const [proposals, setProposals] = useState<searchProposal[]>([])
    const [searchingState, setSearchingState] = useState(false);
    const [searchbarIsFocused, setSearchbarIsFocused] = useState(false); 
    const [searchbarContainerIsHovered, setSearchbarContainerIsHovered] = useState(false);
    const wasFocused = useDeferredValue(searchbarIsFocused)
    const proposalsVisibility = useMemo(()=>{
        if(searchbarIsFocused){
            return "--active";
        }else if(searchbarContainerIsHovered && wasFocused){
            return "--active"
        }
        return "--inactive";
    }, [searchbarContainerIsHovered, searchbarIsFocused])
    let changeTimeoutRef: React.MutableRefObject<NodeJS.Timeout | false> = useRef(false)
    let moreProposals = proposals.length

    const updateProposals = (value: string) => {
            if(changeTimeoutRef.current) clearTimeout(changeTimeoutRef.current);
            if(value !== ""){
                setSearchingState(true);
                changeTimeoutRef.current = setTimeout(()=>{
                    const currentProposals:searchProposal[] = []
                    moreProposals = 0
                    props.productNames.forEach((productName)=>{
                        if(productName.toLowerCase().includes(value.toLowerCase().trim())){
                            if(currentProposals.length < 3){
                                currentProposals.unshift(<li 
                                    className="store-aside__searchbar-proposals__list__item">
                                        {productName}
                                </li>)
                                moreProposals++;
                            }else{
                                moreProposals++
                            }
                        }
                    })
                    setProposals(currentProposals)
                    setSearchingState(false)
                }, 1000)
            }else{
                setProposals([])
                setSearchingState(false)
            }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>)=>{
        setSearchbarVal(event.target.value)
        updateProposals(event.target.value)
    }

    const submitSearchbar = ()=>{
        props.setSearchVal(searchbarVal.trim().toLowerCase());
        updateProposals(searchbarVal);
    }

    useEffect(()=>{
        setProposals([])
        updateProposals(searchbarVal)
    }, [props.productNames])
    useEffect(()=>{
        if(props.searchVal !== searchbarVal.toLowerCase()) setSearchbarVal(props.searchVal)
    }, [props.searchVal])

    return(
        <div className="store-aside__searchbar-layout"
            onMouseEnter={()=>setSearchbarContainerIsHovered(true)}
            onMouseLeave={()=>setSearchbarContainerIsHovered(false)}>
            <div className="store-aside__searchbar">
                <input key="storeSearchbar" 
                    type="search"
                    className="store-aside__searchbar__input" 
                    value={searchbarVal} 
                    onChange={handleChange} 
                    onFocus={()=>setSearchbarIsFocused(true)} 
                    onBlur={()=>setSearchbarIsFocused(false)}
                    placeholder='Search products'></input>
                <div className="store-aside__searchbar__cathegory">
                    <select>
                        {/* {put here cathegories, default should be currentCathegory} */}
                        {/* also make state variable so proposals can be made accordingly */}
                        {/* <option value="0">Select car:</option> */}
                        {/* custom select example: 
                        https://www.w3schools.com/howto/tryit.asp?filename=tryhow_custom_select */}
                    </select>
                </div>    
                <button 
                    className="store-aside__searchbar__submit" 
                    onClick={()=>{
                        // May be needed to add some logic to lose visibility of proposals after searching.
                        submitSearchbar()
                    }}>Search</button>
            </div>
            <div className={`store-aside__searchbar-proposals${proposalsVisibility}`}>
                <ul className="store-aside__searchbar-proposals__list">
                    {...proposals}
                    {proposals.length > 0 
                        ? proposals.length > 3 && 
                            <li className="store-aside__searchbar-proposals__list__sub-item">{moreProposals} more products</li>
                        : !searchingState && props.searchVal.length > 0 && searchbarVal.length > 0
                            ? <li className="store-aside__searchbar-proposals__list__sub-item">Couldn't find products, try restarting filters</li>
                            : searchingState && searchbarVal.length > 0 
                                && <li className="store-aside__searchbar-proposals__list__sub-item">Searching...</li>
                    }
                </ul>
            </div>
        </div>
    )
}



export default Searchbar