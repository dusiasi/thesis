import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// types
import { User } from "../../types/User";
import { ChannelType } from "../../types/Channel";
// services
import { getAllUsers } from "../../services/UserClientService";
// components
import TestPlayer from "../../components/TestPlayer/TestPlayer";
import { useMainContext } from "../../components/Context/Context";
import AddMembersSelect from "../../components/AddMembersSelect/AddMembersSelect";
import AddMixtapeForm from "../../components/AddMixtapeForm/AddMixtapeForm";
// styling
import { MdPlayArrow } from "react-icons/md";
import AudioWave from "../../components/AudioWave/AudioWave";

const Channel = () => {
  const { user } = useMainContext();
  const location = useLocation();
  const [channel, setChannel] = useState<ChannelType>(location.state.channel);
  const [showMixForm, setShowMixForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);

  const initialState = {
    name: '',
    url: '',
    duration: 0,
    creator: user,
    parentChannel: channel,
    channels: [],
    users: [],
  };

  const [users, setUsers] = useState<User[]>(initialState.users)

  useEffect(() => {
    async function retrieveAllUsers() {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers)
      } catch (error) {
        console.error('error getting all users')
      }
    }
    setChannel(channel);
    retrieveAllUsers();
  }, [channel])


  const toggleMixForm = () => {
    setShowMixForm(!showMixForm)
    setShowMemberForm(false)

  }
  const toggleMemberForm = () => {
    setShowMemberForm(!showMemberForm)
    setShowMixForm(false)
  }

  return (
    <div id="channel">
      <div id="channel-element" className="text-tapeWhite h-72 bg-gradient-to-r from-tapePink to-tapeYellow flex justify-between p-10 w-11/12 m-12 rounded-2xl" >
        <div id="channel-info" className="w-2/5 text-xl" >
          <h1 className="flex items-stretch text-3xl font-bold my-3" ><MdPlayArrow size={35} />{channel.name}</h1>
          <p className="pl-3" >{channel.mixTapes.length ? `${channel.mixTapes.length} mixtape${channel.mixTapes.length === 1 ? '' : 's'}` : 'No mixtapes'}</p>
          <p className="pl-3">{channel.members.length ? `${channel.members.length} member${channel.members.length === 1 ? '' : 's'}` : 'No members'}</p>
        </div>
          <AudioWave/>
        <img src={channel.picture} className="w-48 rounded-2xl object-cover" />

      </div>
      <button onClick={toggleMixForm} className="white-button ml-12" >Add Mixtape</button>
      <button onClick={toggleMemberForm} className="white-button" >Add Members</button>
      {
        showMixForm ? (
         <AddMixtapeForm  channelId={channel._id} setChannel={setChannel} user={user} setShowMixForm={setShowMixForm}/> ) : (<></>)
      }
      {
        showMemberForm ? (
          <AddMembersSelect channelId={channel._id} setChannel={setChannel} />) : (<></>)
      }
      <TestPlayer />
    </div>
  )

}

export default Channel;