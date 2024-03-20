import { apiClient } from "./ApiClient";
import { ChannelType } from "../types/Channel";

// Get channels for the logged in user GET
export const getChannelsByUser = async (userId: string) => {
  return await apiClient<ChannelType[]>(`channels/${userId}`, 'GET');
}

// Create new channel
export const createChannel = async (body: Omit<ChannelType, '_id'>) => {
  return await apiClient<ChannelType>('channels', 'POST', body);
}

// Edit channel
export const editChannel = async (channelId: string, body: ChannelType) => {
  return await apiClient<ChannelType>(`channels/${channelId}`, 'PUT', body);
}

// Add user to channel
export const addUserToChannel = async (channelId: string, userId: string) => {
  return await apiClient<ChannelType>(`channels/addUser/${channelId}/${userId}`, 'POST')
}
