import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useDebugValue, useState } from 'react';
import { PlayerData, usePlayerStoreContext } from './players.store';
import './Popup.css'


const Popup = observer(() => {
  const ctx = usePlayerStoreContext();
  const players = ctx.players;

  function setPlayerData(data: PlayerData[]) {
    runInAction(() => {
      ctx.players = data;
    })
  }

  function onAddPlayerClick(){
    setPlayerData([...players, {username: "New user", imageURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/jerma985-profile_image-447425e773e6fd5c-300x300.jpeg"}])
  }

  return (
    <div className="App">
      <div className='TopBanner py-2 mx-0 shadow-xl'>
        <p className='text-lg text-white'>Custom Gartic Avatars</p>
      </div>
      <ul className='PlayerHolder mx-3'>
        {players.map((player, index) => (<PlayerDisplay 
          playerData={player}
          index={index}
          fullData={players}
          setData={setPlayerData}
          key={index}
        ></PlayerDisplay>)
        )}

        <button id='AddPlayerButton' className='AddButton text-6xl border-2 border-white align-middle text-center text-white border-dotted rounded-2xl min-w-full' onClick={onAddPlayerClick}>+</button>
      </ul>
    </div>
  )
});

function PlayerDisplay({playerData, index, fullData, setData}: {playerData: PlayerData, index: number, fullData: PlayerData[], setData: (data: PlayerData[]) => void}): JSX.Element{

  function handleTextChange(event: React.FormEvent<HTMLInputElement>){
    const target = event.target as HTMLInputElement
    handleChange({username: target.value});
  }

  function setImageURL(url: string) {
    handleChange({imageURL: url});
  }

  function handleChange(change: Partial<PlayerData>) {
    const newData = [...fullData]
    const player = {
      ...newData[index],
      ...change
    }
    newData[index] = player
    setData(newData)
  }

  function handleRemove(){
    const cleanedPlayerData = [...fullData]
    cleanedPlayerData.splice(index,1)
    setData(cleanedPlayerData)
  }

  return (
    <li className='AvatarHolder flex justify-start my-3 rounded-2xl shadow-md'>
      <PhotoSelect playerData={playerData} setImageURL={setImageURL}></PhotoSelect>
      <input className="AvatarUsername basis-3/4 uppercase bg-transparent placeholder-gray-500" name='username' onChange={handleTextChange} placeholder="I'm blank!" value={playerData.username}></input>
      <button className='AvatarDelete rounded-full mx-3 my-0.5 px-2 text-md absolute right-1' onClick={handleRemove}>x</button>
    </li>
  )
}

const PhotoSelect = ({playerData, setImageURL}: {playerData: PlayerData, setImageURL: (photo: string) => void}) => {
  function onChangePhoto(event: React.FormEvent<HTMLInputElement>){
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(target.files[0]);
      fileReader.addEventListener("load", () => {
        setImageURL(fileReader.result as string);
      });    
    }
  }
  return (
    <label className='PhotoSelect cursor-pointer hover:opacity-70'>
      <input type='file' accept='image/*' onChange={onChangePhoto} className="hidden"></input>
      <img className='AvatarPicture h-14 my-1 mx-1 aspect-square rounded-full items-center' src={playerData.imageURL} alt={playerData.username+"'s avatar"}></img>
    </label>
  )
};

export default Popup