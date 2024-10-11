import { defineStore } from 'pinia';
import { db } from '@/firebase'; // นำเข้า Firebase

export const useChatStore = defineStore('chat', {
  state: () => ({
    // สถานะที่เกี่ยวข้องกับแชท
  }),
  actions: {
    async loadMessages(friendId) {
      // ฟังก์ชันสำหรับดึงข้อความจาก Firebase
      const snapshot = await db.collection('chats').doc(friendId).collection('messages').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async sendMessage(friendId, messageText) {
      // ฟังก์ชันสำหรับส่งข้อความไปยัง Firebase
      const message = {
        sender: 'currentUserId', // ใช้ ID ของผู้ใช้ที่ลงชื่อเข้าใช้
        text: messageText,
        timestamp: new Date(),
      };
      await db.collection('chats').doc(friendId).collection('messages').add(message);
    }
  }
});
