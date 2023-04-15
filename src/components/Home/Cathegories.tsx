import { DocumentData } from "firebase/firestore/lite"
import { homePageComponentsData } from "../../pages/Home"

interface Cathegory{
    cathegoriesData: DocumentData,
    id: string
}
export default function Cathegories(props: homePageComponentsData){
    const cathegories = props.data.map( (cathegory:Cathegory) =>{
      const localStyle = {
        backgroundImage: `url(${props.photosPath+cathegory.cathegoriesData.photo})`,
      }
      const data = cathegory.cathegoriesData
      return <div className="cathgegories__cathegory-block" style={localStyle} key={`cathegory${cathegory.id}div`}>
        <h3 className="cathegories__cathegory-block__title">{data.title}</h3>
        <p className="cathegories__cathegory-block__description">{data.description}</p>
        <button className="cathegories__cathegory-block__button">See More</button>
      </div>
    })
    return(
        <div className="cathegories">
            {cathegories}
        </div>
    )
}