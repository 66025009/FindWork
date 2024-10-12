<script setup>
import UserLayout from '@/layouts/UserLayout2.vue'
import Friend from '@/components/friend.vue'  // ถ้าไฟล์ชื่อ friend.vue 
import { ref } from 'vue'
import { useUserStore } from '@/stores/user/user'
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore' // นำเข้า Firestore
import ChatComponent from '@/components/ChatComponent.vue'

const userStore = useUserStore()
const chats = ref([]) // กำหนดสถานะสำหรับสนทนา
const messages = ref([]) // กำหนดสถานะสำหรับข้อความ
const newMessage = ref('') // กำหนดสถานะสำหรับข้อความใหม่
const fileInput = ref(null) // สร้างการอ้างอิงไปยัง input file
const currentChatId = ref(null)

// ฟังก์ชันกระตุ้นการคลิกที่ input file
const triggerFileInput = () => {
  fileInput.value.click()
}

// ฟังก์ชันสำหรับการอัปโหลดภาพ
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // สร้าง URL สำหรับแสดงภาพที่อัปโหลด
    const imageUrl = URL.createObjectURL(file)
    sendMessage(imageUrl) // ส่งภาพพร้อมข้อความ
    event.target.value = null // รีเซ็ต input file
  }
}
const selectFriend = (friendId) => {
  // ค้นหาหมายเลข chatId ที่ตรงกับ friendId (คุณต้องเขียนฟังก์ชันนี้ให้ถูกต้อง)
  currentChatId.value = findChatIdByFriendId(friendId)
}

const findChatIdByFriendId = (friendId) => {
  // จำลองการคืนค่า chatId (ควรเชื่อมต่อกับ Firebase หรือฐานข้อมูลจริง)
  return 'exampleChatId123' 
}

// ฟังก์ชันส่งข้อความ
const sendMessage = async (imageUrl = null) => {
  if (currentChatId.value && (newMessage.value.trim() || imageUrl)) {
    const message = {
      id: Date.now(),
      text: newMessage.value,
      imageUrl: imageUrl,
      senderId: userStore.currentUser.id,
    }

    // อัปเดตข้อความใน Firestore
    const db = getFirestore()
    const chatRef = doc(db, 'chats', currentChatId.value)

    await updateDoc(chatRef, {
      messages: arrayUnion(message) // เพิ่มข้อความใหม่
    })

    messages.value.push(message) // เพิ่มข้อความใหม่ในสถานะท้องถิ่น
    newMessage.value = '' 
  }
}
</script>



<template>
  <UserLayout>
    <div class="flex mt-6 mx-6 h-screen space-x-4">
      <Friend @select-friend="selectFriend" />
      <div class="w-3/4 flex flex-col h-full bg-gray-100 rounded-lg">
        <div class="flex-grow p-4 overflow-y-auto">
          <ul>
            <li v-for="message in messages" :key="message.id" class="mb-2">
              <div :class="{'flex justify-end': message.senderId === userStore.currentUser.id, 'flex justify-start': message.senderId !== userStore.currentUser.id}">
                <div :class="{'p-2 bg-blue-100 rounded-lg shadow max-w-xs mr-2': message.senderId === userStore.currentUser.id, 'p-2 bg-gray-200 rounded-lg shadow max-w-xs mr-2': message.senderId !== userStore.currentUser.id}">
                  <p>{{ message.text }}</p>
                  <img v-if="message.imageUrl" :src="message.imageUrl" class="mt-2 rounded-lg" style="max-width: 300px;" />
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="flex p-4 border-t border-gray-300 space-x-4">
          <div>
            <button class="material-symbols-outlined text-blue-400" style="font-size: 45px;" @click="triggerFileInput">
              image
            </button>
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleImageUpload" 
              class="ml-2 hidden" 
            />
          </div>
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="พิมพ์ข้อความ..."
            class="flex-grow p-2 border border-gray-300 rounded-lg"
          />
          <button @click="sendMessage" class="btn btn-neutral ml-2">ส่ง</button>
        </div>
      </div>
    </div>
  </UserLayout>
</template>