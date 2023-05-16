import { ChangeEvent, FC, useRef, useState } from 'react';
interface SearchbarProps{
    productNames: string[];
    setSearchVal: (val: string) => void;
}
type searchProposal = JSX.Element
const Searchbar: FC<SearchbarProps> = (props: SearchbarProps)=>{
    const [searchbarVal, setSearchbarVal] = useState("")
    const [proposals, setProposals] = useState<searchProposal[] >([])
    
    let changeTimeoutRef: React.MutableRefObject<NodeJS.Timeout | false> = useRef(false)
    let moreProposals = proposals.length

    const handleChange = (event: ChangeEvent<HTMLInputElement>)=>{
        setSearchbarVal(event.target.value)
        if(changeTimeoutRef.current) clearTimeout(changeTimeoutRef.current);
        if(event.target.value !== ""){
            changeTimeoutRef.current = setTimeout(()=>{
                const currentProposals:searchProposal[] = []
                moreProposals = 0
                props.productNames.forEach((productName)=>{
                    console.log(productName)
                    if(productName.toLowerCase().includes(event.target.value.toLowerCase())){
                        console.log("banan")
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
            }, 1000)
        }else{
            setProposals([])
        }
    }

    const submitSearchbar = ()=>{
        props.setSearchVal(searchbarVal)
    }

    return(
        <div className="store-aside__searchbar-layout">
            <div className="store-aside__searchbar">
                <input key="storeSearchbar"className="store-aside__searchbar__input" value={searchbarVal} onChange={handleChange} placeholder='Search products'></input>
                <button className="store-aside__searchbar__submit" onClick={()=>submitSearchbar}>Search</button>
            </div>
            <div className="store-aside__searchbar-proposals">
                <ul className="store-aside__searchbar-proposals__list">
                    {...proposals}
                    {proposals.length > 0 && moreProposals}
                </ul>
            </div>
        </div>
    )
}



export default Searchbar