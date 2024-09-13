<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import AdminLayout from '@/layouts/AdminLayout.vue'

// สร้างตัวแปรเพื่อเก็บข้อมูลผู้ใช้
const users = ref([])

// สร้างตัวแปรเพื่อจัดการการแสดงเมนูลบ
const menuVisible = ref(null)

// ดึงข้อมูลผู้ใช้จาก Firestore เมื่อคอมโพเนนต์ถูก mount
onMounted(async () => {
  const db = getFirestore() // เรียกใช้งาน Firestore
  const querySnapshot = await getDocs(collection(db, 'user')) // ดึงข้อมูลจากคอลเล็กชัน 'user'

  // อัปเดต users ด้วยข้อมูลที่ดึงมา
  users.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() // ข้อมูลจาก Firestore รวมถึงโปรไฟล์รูปภาพและชื่อ
  }))
})

// ฟังก์ชันลบบัญชี
const deleteUser = async (userId) => {
  const db = getFirestore()
  await deleteDoc(doc(db, 'user', userId))
  // อัปเดต list ของผู้ใช้หลังจากลบ
  users.value = users.value.filter(user => user.id !== userId)
}

// ฟังก์ชันเพื่อเปลี่ยนสถานะการแสดงเมนู
const toggleMenu = (userId) => {
  menuVisible.value = menuVisible.value === userId ? null : userId
}
</script>

<template>
  <AdminLayout>
    <div class="bg-indigo rounded-lg mt-10 p-8 shadow-lg">
      <!-- Title -->
      <div class="text-center mb-6 space-y-4">
        <h1 class="text-3xl text-white font-bold">จัดการผู้ใช้งาน</h1>
        <p class="text-white text-lg">จัดการผู้ใช้งานที่มีบัญชีจากที่นี่</p>
      </div>

      <!-- User List -->
      <div class="space-y-4">
        <!-- Loop through users and display each user -->
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items-center justify-between p-4 bg-indigo-800 rounded-lg shadow-md relative"
        >
          <!-- User Profile Picture -->
          <div class="flex items-center space-x-4">
            <img
              :src="user.profileImage || '/profileImage.jpg'"
              alt="User profile"
              class="w-12 h-12 rounded-full object-cover"
            />
            <p class="text-white text-lg font-semibold">{{ user.name || 'ผู้ใช้งาน' }}</p>
          </div>

          <!-- Menu Icon -->
          <button 
            @click="toggleMenu(user.id)"
            class="bg-white text-indigo-900 rounded-full p-2"
          >
            <span class="material-symbols-outlined">more_vert</span>
          </button>

          <!-- Delete Menu -->
          <div v-if="menuVisible === user.id" class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
            <button
              @click="deleteUser(user.id)"
              class="w-full text-red-600 hover:bg-red-100 py-2 px-4 text-left rounded-lg"
            >
              ลบบัญชีของผู้ใช้รายนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
