"use client"
import { create } from "zustand";

type Message = {
  deviceId: string;
  time: number;
  state: string;
};

type MessageStore = {
  message?: Message;
  setMessage: (msg: Message) => void;
  reset: () => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  message: undefined,
  setMessage: (msg) => set({ message: msg }),
  reset: () => set({ message: undefined }),
}));
