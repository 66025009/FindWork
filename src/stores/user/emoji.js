import { defineStore } from 'pinia'

export const useEmojiStore = defineStore('emoji', {
  state: () => ({
    emoji: [
      "ความสุข 😀","ห่วงใย 🥰","บ้าบอ 🤪","สงสัย 🤨",
      "เฉยเฉย 😐","รัก 😍"
    ]
  }),
  getters: {
    getEmoji: (state) => state.emoji
  }
})
