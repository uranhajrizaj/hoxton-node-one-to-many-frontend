import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

type Work={
  id:number,
  nane:string,
  picture:string
}

type Museum={
  id: number,
  name:string,
  city:string,
  works:Work[]
}

function App() {
  const [museumsWithWorks, setMuseumsWithWorks] = useState<Museum[]>([])
  
  useEffect(()=>{
    fetch(`http://localhost:4444/museums`)
    .then(res=>res.json())
    .then(museumsFromServer=>setMuseumsWithWorks(museumsFromServer))
  },[])
  return (
    <div className="App">
      <form onSubmit={(e)=>{
        e.preventDefault()
        const newMuseum={
          name: e.target.name.value,
          city:e.target.city.value
        }
        fetch(`http://localhost:4444/museums`,{
          method: "POST",
          headers:{
            "Content-Type": "application/json"
          },
          body:JSON.stringify(newMuseum)
        })
        .then(resp=>resp.json())
        .then(museum=>setMuseumsWithWorks([...museumsWithWorks , museum]))
      }}>
        <h4>ADD A NEW MUSEUM</h4>
        <input placeholder="Name of Museum" name="name"/>
        <input placeholder="City of Museum "  name="city"/>
        <button>Add Museum </button>
      </form>
      <form onSubmit={(e)=>{
        e.preventDefault()
        const newWork={
          name: e.target.name.value,
          picture:e.target.picture.value,
          museumId:Number(e.target.museumId.value)
        }
        fetch(`http://localhost:4444/works`,{
          method: "POST",
          headers:{
            "Content-Type": "application/json"
          },
          body:JSON.stringify(newWork)
        })
        .then(resp=>resp.json())
        .then(museumOfNewWork=>{
          const newWork=museumOfNewWork.works[0]
          
          const newState=museumsWithWorks.map(museum =>museum.id===museumOfNewWork.id ? {...museum, works:[...museum.works,newWork] }:museum)
          console.log(newState)
          return setMuseumsWithWorks(newState)    
        } 
        )
    

      }
       }>
        <h4>ADD A NEW WORK</h4>
        <input placeholder="Name of work" name="name"/>
        <input placeholder="Picture of work" name="picture"/>
        <input placeholder="Museum ID" name="museumId"/>
        <button>Add Work </button>
      </form>
      <ul className='museums'>
     { 
      museumsWithWorks.map(museum=>
        <li className='museum'>
          <h4> {museum.name}, {museum.city} </h4>
          <div className='info'> 
            {museum.works.length!==0?museum.works.map(work=>
             <div className='item'> 
             <img src={work.picture}/>
              <h5>{work.name}</h5></div>
              ):null}
          </div>
        </li>)
     }
     </ul>
    </div>
  )
}

export default App
