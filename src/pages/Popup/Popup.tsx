import React from 'react'
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
  return (
    <div className="App">
      <div className='TopBanner py-2 mx-0 shadow-xl'>
        <p className='text-lg text-white'>Custom Gartic Avatars</p>
      </div>
      <ul className='PlayerHolder mx-3'>
        {dummyData.map((player) => (<PlayerDisplay playerData={player}></PlayerDisplay>))}

        <AddButton></AddButton>
      </ul>
    </div>
  )
}

function PlayerDisplay({playerData}: {playerData: PlayerData}): JSX.Element{
  console.log(playerData)
  return (
    <li className='AvatarHolder flex justify-start my-3 rounded-2xl shadow-md'>
      <img className='AvatarPicture h-14 my-1 mx-1 aspect-square rounded-full items-center' src={playerData.imageURL} alt={playerData.username+"'s avatar"}></img>
      <p className='AvatarUsername uppercase text-left align-middle items-center'>{playerData.username}</p>
    </li>
  )
}

function AddButton(): JSX.Element{
  return (
    <button className='AddButton text-6xl border-2 border-white align-middle text-center text-white border-dotted rounded-2xl min-w-full'>+</button>
  )
}

export default Popup
