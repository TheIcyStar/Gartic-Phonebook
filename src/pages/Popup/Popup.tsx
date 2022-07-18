import React, { useDebugValue, useState } from 'react';
import './Popup.css'

type PlayerData = {
  username: string,
  imageURL: string
}
const dummyData: PlayerData[] = [
  {
    username: "OnlyTwentyCharacters",
    imageURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/fd195f6a-5b03-41d4-9e92-e8e4019fb9f8-profile_image-300x300.png"
  },
  {
    username: "asdf",
    imageURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/jerma985-profile_image-447425e773e6fd5c-300x300.jpeg"
  }
]

const Popup = () => {
  const [data, setData] = useState<PlayerData[]>(dummyData)

  function onAddPlayerClick(){
    setData([...data, {username: "New user", imageURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/jerma985-profile_image-447425e773e6fd5c-300x300.jpeg"}])
  }

  return (
    <div className="App">
      <div className='TopBanner py-2 mx-0 shadow-xl'>
        <p className='text-lg text-white'>Custom Gartic Avatars</p>
      </div>
      <ul className='PlayerHolder mx-3'>
        {data.map((player, index) => (<PlayerDisplay 
          playerData={player}
          index={index}
          fullData={data}
          setData={setData}
        ></PlayerDisplay>)
        )}

        <button className='AddButton text-6xl border-2 border-white align-middle text-center text-white border-dotted rounded-2xl min-w-full' onClick={onAddPlayerClick}>+</button>
      </ul>
    </div>
  )
}

function PlayerDisplay({playerData, index, fullData, setData}: {playerData: PlayerData, index: number, fullData: PlayerData[], setData: React.Dispatch<React.SetStateAction<PlayerData[]>>}): JSX.Element{

  function handleTextChange(event: React.FormEvent<HTMLInputElement>){
    console.log(event)
  }

  return (
    <li className='AvatarHolder flex justify-start my-3 rounded-2xl shadow-md'>
      <img className='AvatarPicture h-14 my-1 mx-1 aspect-square rounded-full items-center' src={playerData.imageURL} alt={playerData.username+"'s avatar"}></img>
      <input className="AvatarUsername basis-3/4 uppercase bg-transparent placeholder-gray-500" name='username' onChange={handleTextChange} placeholder="New user"></input>
    </li>
  )
}

export default Popup
