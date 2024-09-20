<script setup>
import UserLayout from '@/layouts/UserLayout2.vue'
import { ref, onMounted } from 'vue'
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { ref as storageRef, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'

// Message
const chats = ref([])
const selectedChat = ref(null)
const messages = ref([])
const newMessage = ref('')
const storage = getStorage()

// Users and Friends
const users = ref([])
const friends = ref([])
const selectedUser = ref(null)

// file uploads
const fileInput = ref(null)


const fetchChats = async (currentUserId) => {
  try {
    const chatsRef = collection(db, 'chats')
    // ดึงเฉพาะแชทที่มี currentUserId อยู่ในรายชื่อผู้เข้าร่วม
    const q = query(chatsRef, where('participants', 'array-contains', currentUserId))
    const snapshot = await getDocs(q)
    chats.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error fetching chats:", error)
  }
}


const fetchUsers = async () => {
  try {
    const usersRef = collection(db, 'users')
    const snapshot = await getDocs(usersRef)
    users.value = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      profileImage: doc.data().profileImage // เก็บข้อมูลรูปโปรไฟล์
    }))
  } catch (error) {
    console.error("Error fetching users:", error)
  }
}


const fetchFriends = async (currentUserId) => {
  try {
    // Retrieve the list of friends for the current user
    const friendsRef = collection(db, 'friends')
    const q = query(friendsRef, where('userId', '==', currentUserId))
    const snapshot = await getDocs(q)
    const friendIds = snapshot.docs.map(doc => doc.data().friendId)
    
    if (friendIds.length === 0) {
      friends.value = []  // No friends found
      return
    }
    
    // Retrieve the user details of the friends
    const usersRef = collection(db, 'users')
    const friendsSnapshot = await getDocs(query(usersRef, where('id', 'in', friendIds)))
    friends.value = friendsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error fetching friends:", error)
  }
}


const sendMessage = async () => {
  if (newMessage.value.trim() === '' && !fileInput.value.files.length) return
  
  try {
    let imageUrl = null

    // ถ้ามีไฟล์รูปภาพที่เลือก ให้อัปโหลดก่อน
    if (fileInput.value.files.length > 0) {
      const file = fileInput.value.files[0]
      imageUrl = await uploadImage(file) // ดึง URL รูปภาพที่อัปโหลด
    }

    // ส่งข้อความไปที่ Firestore
    const message = {
      chatId: selectedChat.value,
      text: newMessage.value,
      imageUrl: imageUrl, // ใส่ URL รูปภาพถ้ามี
      timestamp: serverTimestamp()
    }
    const messageRef = collection(db, 'messages')
    await addDoc(messageRef, message)
    
    // เพิ่มข้อความใหม่ในหน้าจอแชท
    messages.value.push({
      ...message,
      id: 'temp-id',
      timestamp: new Date()
    })

    // รีเซ็ตค่า
    newMessage.value = ''
    await fetchMessages(selectedChat.value)
    fileInput.value.value = '' // รีเซ็ต input รูปภาพ

  } catch (error) {
    console.error("Error sending message:", error)
  }
}


const fetchMessages = async (chatId) => {
  try {
    const messagesRef = collection(db, 'messages')
    const q = query(messagesRef, where('chatId', '==', chatId))
    const snapshot = await getDocs(q)
    
    // เรียงลำดับตาม timestamp
    messages.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => a.timestamp.seconds - b.timestamp.seconds)  // เรียงจากน้อยไปมาก

    selectedChat.value = chatId

    // เลื่อนลงไปที่ข้อความล่าสุด
    scrollToBottom()

  } catch (error) {
    console.error("Error fetching messages:", error)
  }
}



const addFriend = async (friendId) => {
  try {
    const friendsRef = collection(db, 'friends')
    await addDoc(friendsRef, {
      userId: 'yourUserId',
      friendId: friendId,
      timestamp: serverTimestamp()
    })
    console.log('Friend added successfully')
    await fetchFriends()  // Refresh friends list after adding a new friend
  } catch (error) {
    console.error("Error adding friend:", error)
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// Function to handle file selection
const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      // สร้างอ้างอิงไปยัง Firebase Storage
      const storageReference = storageRef(storage, `files/${file.name}`)

      // อัปโหลดไฟล์
      await uploadBytes(storageReference, file)
      console.log('File uploaded successfully')

    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }
}


const scrollToBottom = () => {
  const chatContainer = document.querySelector('.flex-grow.p-4.overflow-y-auto')
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
}

// อัปโหลดไฟล์และคืน URL
const uploadImage = async (file) => {
  try {
    const storageReference = storageRef(storage, `chat-images/${file.name}`)
    
    // อัปโหลดไฟล์ไปยัง Firebase Storage
    await uploadBytes(storageReference, file)
    
    // ดึง URL สำหรับแสดงภาพ
    const downloadURL = await getDownloadURL(storageReference)
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}


// On mount
onMounted(() => {
  const currentUserId = 'yourUserId' // ต้องแทนค่าด้วย user ID ของผู้ใช้งานปัจจุบัน
  fetchChats(currentUserId)
  fetchUsers()
  fetchFriends(currentUserId)
})

</script>



<template>
    <UserLayout>
      <!-- กรอบรายการแชท -->
      <div class="flex mt-4 ml-4 space-x-4">
        <div class="w-1/4 h-[600px] bg-white p-4 border border-gray-800 rounded-lg space-y-6">
          <h2 class="font-bold text-lg mb-4">ข้อความ</h2>
  
          <!-- Section ที่มีไอคอนและปุ่ม -->
          <div class="flex items-center space-x-4 mb-4">
            <div class="bg-gray-200 p-2 rounded-full">
              <img src="https://cdn-icons.flaticon.com/svg/3917/3917754.svg?token=exp=1726416234~hmac=343284c05915b27b9cd17f1097bbe988" alt="Avatar" class="w-8 h-8" />
            </div>
            <button class="btn btn-neutral w-32 rounded-full">แชท</button>
            <button class="btn btn-neutral w-32 rounded-full">กลุ่ม</button>
          </div>

          <div class="container mx-auto">
      <h1 class="text-2xl font-bold mb-4">แอดเพื่อน</h1>

      <!-- รายชื่อผู้ใช้ทั้งหมด -->
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">รายชื่อผู้ใช้</h2>
        <ul>
          <li v-for="user in users" :key="user.id" class="flex justify-between items-center mb-2">
            <span>{{ user.name }}</span>
            <button @click="addFriend(user.id)" class="bg-blue-500 text-white px-4 py-2 rounded-lg">แอดเพื่อน</button>
          </li>
        </ul>
      </div>

      <div class="divider divider-neutral"></div>

      <!-- รายชื่อเพื่อน -->
          <div class="bg-gray-100 p-4 rounded-lg shadow-md mt-6">
            <h2 class="text-lg font-semibold mb-4">เพื่อน</h2>
            <ul>
              <li v-for="friend in friends" :key="friend.id" class="flex justify-between items-center mb-2">
                <span>{{ friend.name }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-base-300 rounded-box h-20 flex-grow place-items-center p-2">
          <div class="flex w-full items-center space-x-4">
           <div class="avatar online">
            <div class="w-16 rounded-full">
             <img alt="Chat" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
           </div>
    <!-- Display the user's name -->
        <!--รอแก้ไข ตรงที่ใส่ว่า Arm -->
           <div>{{ Arm }}</div> 
         </div>
        </div>
          <!-- Section รายการแชท -->
          <div v-if="chats.length" class="overflow-y-auto space-y-4 ">
            <ul>
              <li v-for="chat in chats" :key="chat.id" class="flex items-center space-x-4 cursor-pointer" @click="fetchMessages(chat.id)">
                <img :src="chat.profileImage" alt="Profile" class="w-12 h-12 rounded-full object-cover"/>
                <div>
                  <h3 class="font-semibold">{{ chat.name }}</h3>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- กรอบข้อความแชท -->
        <div class="w-3/4 bg-gray-100 rounded-lg flex flex-col h-[600px] mr-4">
        <div class="bg-neutral-content flex rounded-t-lg">
          <div class="navbar rounded-tl-lg rounded-tr-lg bg-neutral text-neutral-content">
            <div class="avatar online">
              <div class="w-16 rounded-full">
                <img alt="Chat" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
          </div>
        </div>
<div class="flex-grow p-4 overflow-y-auto">
  <ul>
    <li v-for="message in messages" :key="message.id" class="mb-2">
      <div :class="{'flex justify-end': message.senderId === currentUserId, 'flex justify-start': message.senderId !== currentUserId}">
        <div :class="{'p-2 bg-blue-100 rounded-lg shadow max-w-xs': message.senderId === currentUserId, 'p-2 bg-gray-200 rounded-lg shadow max-w-xs': message.senderId !== currentUserId}">
          <p>{{ message.text }}</p>
          <img v-if="message.imageUrl" :src="message.imageUrl" alt="Image" class="w-32 h-32 object-cover mt-2">
          <small>{{ new Date(message.timestamp.seconds * 1000).toLocaleTimeString() }}</small>
        </div>
      </div>
    </li>
  </ul>
</div>


    

  <!-- กรอบสำหรับส่งข้อความ -->
  <div class="flex items-center justify-between p-4 border-t ">
    <div>
    <!-- Hidden file input -->
    <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;"/>
    <!-- Trigger button -->
    <a role="button" class="btn rounded-full p-2  mr-2 bg-primary"  @click="triggerFileInput">
     <img src="" alt="เพิ่มรูปภาพ" class="w-9 h-8">
    </a>
  </div>
    <input v-model="newMessage" type="text" placeholder="ข้อความ" class="w-full p-2 border rounded-lg" />
    <button @click="sendMessage" class="ml-4 btn btn-primary">ส่ง</button>
  </div>

          </div>
        </div>
    </UserLayout>
  </template>

<style scoped>
/* สไตล์เพิ่มเติมถ้าต้องการ */
</style>