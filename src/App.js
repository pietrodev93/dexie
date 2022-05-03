import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import './App.css';
import { db } from './db';

function App() {
  const prodottiInArray = useLiveQuery(
    () => db.item.toArray()
  )
  const [items, setItems] = useState([])
  const [item, setItem] = useState('')
  const [completed, setCompleted] = useState([])

 useEffect(() => {
  const prodotti =  prodottiInArray && prodottiInArray.map((r) => r.item)
  setItems(prodotti)

 },[prodottiInArray])
  
 
  const saveItem = async (e) => {
    e.preventDefault()
    try{
      await db.item.add({
        item
      });
      setItems([...items, item])
      setItem('')
    } catch(error){
      console.log(error)
    }
  }
  const removeItem = async(r) => {
    try{
      await db.item.delete(r)
      setItems(items.filter(e => e !== r))
      setCompleted([...completed, r])
    } catch(error) {
      console.log(error)
    }
  }

  const recoverItem = (r) => {
    setCompleted(completed.filter(e => e !== r))
    setItems([...items, r])
  }

  return (
    <div className="px-6 bg-[#f6f6f6] h-screen">
      <div className="flex flex-col items-start">
        <h1 className='text-3xl font-medium mt-5'>Lista della spesa:</h1>
        <h3 className='text-xl my-3 text-[#666] font-extralight'>{items?.length > 0 ? `Hai ancora ${items?.length} elementi da comprare` : 'Bravo, hai comprato tutto.'}</h3>
      </div>

      <div className="flex flex-col mt-2">
        <form onSubmit={saveItem} className="mb-6">
          <input type="text" value={item} placeholder='Aggiungi un nuovo elemento...' onChange={(e) => setItem(e.target.value)} className='outline-none bg-transparent w-full' />
        </form>
        {items?.length > 0 ? (
          items?.map((r, i) => (
            <div key={i} className="flex bg-white p-5 my-2 rounded shadow-md">
              <div className="mr-4">
                <input type="checkbox" name="" id="" onChange={() => removeItem(r)} />
              </div>
              <div className="flex flex-col">
                <h3>{r}</h3>
              </div>
            </div>
          ))
        ) : <h1>Non hai nulla da comprare</h1>}
      </div>
      <div className="flex flex-col mt-10">
        {completed.length > 0 ? (
          completed.map((r, i) => (
            <div key={i} className="flex bg-white p-5 my-2 rounded shadow-md opacity-50" onClick={() => recoverItem(r)}>
              <div className="flex flex-col">
                <h3 className='line-through'>{r}</h3>
              </div>
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
}

export default App;
