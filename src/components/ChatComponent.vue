<script setup>
import { ref, onMounted, watch } from 'vue'
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'
import { useUserStore } from '@/stores/user/user' // นำเข้า store สำหรับการจัดการผู้ใช้

const props = defineProps(['chatId']) // รับ chatId จาก parent
const messages = ref([]) // เก็บข้อความแชท
const newMessage = ref('') // เก็บข้อความใหม่
const fileInput = ref(null) // อ้างอิงถึง input file
const userStore = useUserStore() // สร้างตัวแปรสำหรับผู้ใช้
let unsubscribe = null // ใช้สำหรับยกเลิกการเรียก snapshot

// ฟังก์ชันโหลดข้อความเมื่อ chatId เปลี่ยน
const loadMessages = () => {
  if (props.chatId) {
    const db = getFirestore()
    const chatRef = doc(db, 'chats', props.chatId)

    // ยกเลิกการเรียก snapshot ก่อนหน้านี้
    if (unsubscribe) {
      unsubscribe()
    }

    unsubscribe = onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        messages.value = doc.data().messages || []
      }
    })
  }
}
// โหลดข้อความครั้งแรกเมื่อ component ถูก mount
onMounted(loadMessages)

onBeforeUnmount(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

// ฟังก์ชันส่งข้อความ
const sendMessage = (imageUrl = null) => {
  if (newMessage.value.trim() || imageUrl) {
    // สร้างข้อความใหม่
    const message = {
      id: Date.now(), // หรือใช้ไอดีที่คุณสร้าง
      text: newMessage.value,
      imageUrl: imageUrl,
      senderId: userStore.currentUser.id,
    }
    
    // เพิ่มข้อความใหม่ไปยัง Firestore (ใช้ arrayUnion เพื่อเพิ่มข้อความใหม่)
    const db = getFirestore()
    const chatRef = doc(db, 'chats', props.chatId)

    updateDoc(chatRef, {
      messages: arrayUnion(message) // อัปเดตข้อความใหม่
    })

    newMessage.value = '' // รีเซ็ตข้อความใหม่
  }
}

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
</script>

<template>
  <div>
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
</template>
