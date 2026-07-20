import Car from './components/Cars.jsx'
import { useState, useEffect } from "react"

const App = () =>{
  const[Cars, setCars] = useState([])

  useEffect(()=>{
    fetch('api/v1/Cars')
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(err => console.log(err))
  },[]);

   console.log(Cars);

  return(
    <div>
      <h1>Welcome to the Car Stor </h1>
      <ul>
        {Cars.map(car =>(
            <Car key={car.id} {...car} />
        ))}
      </ul>
      </div>
  )
}

export default App