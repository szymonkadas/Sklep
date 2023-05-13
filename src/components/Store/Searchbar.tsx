import { ChangeEvent, FC, useState } from 'react';
interface SearchbarProps{
    productNames: string[];
    setSearchVal: (val: string) => void;
}
const Searchbar: FC<SearchbarProps> = (props: SearchbarProps)=>{
    const [searchbarVal, setSearchbarVal] = useState("")

    const handleChange = (event: ChangeEvent<HTMLInputElement>)=>{
        setSearchbarVal(event.target.value)
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
            <div className="store-aside__searchbar-propositions">
                {/* list */}
            </div>
        </div>
    )
}

export default Searchbar