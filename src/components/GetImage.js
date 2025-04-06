import React, { useEffect,useState } from 'react'
import imageExists from "image-exists"

export default function GetImage({props}) {
  const [state,setState] = useState(false)
  const checkFun = () => {  
    imageExists("./images/"+props+".jpeg",image => {
      if (image)
      setState(true)
      else 
      setState(false)
      })
  }
  useEffect(() =>{
    checkFun();
  })
    return (
      <div>
        {state ?
        <div>
         <img className="align-self-center prod-image" src={"./images/"+props+".jpeg"} alt="Logo" /> 
       </div>
      :
        <div>
        <img className="align-self-center prod-image" src={"./images/all_prod.png"} alt="Logo" /> 
        </div>
        }
      </div>
    )
}
//   export GetImage;