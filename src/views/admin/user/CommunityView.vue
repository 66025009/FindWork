<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import AdminLayout from '@/layouts/AdminLayout.vue'

const db = getFirestore()
const groups = ref([]) // สถานะสำหรับกลุ่ม
const menuVisible = ref(null) // สถานะสำหรับการแสดงเมนู

// ฟังก์ชันดึงกลุ่มทั้งหมดจาก Firestore
const fetchGroups = async () => {
  const groupsCollection = collection(db, 'groups')
  const groupDocs = await getDocs(groupsCollection)
  groups.value = groupDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// ฟังก์ชันลบกลุ่ม
const deleteGroup = async (groupId) => {
  const groupDoc = doc(db, 'groups', groupId)
  await deleteDoc(groupDoc) // ลบกลุ่มจาก Firestore
  // อัปเดตกลุ่มหลังการลบ
  groups.value = groups.value.filter(group => group.id !== groupId) // อัปเดตข้อมูลใน groups
}

// ฟังก์ชันสำหรับแสดง/ซ่อนเมนู
const toggleMenu = (groupId) => {
  menuVisible.value = menuVisible.value === groupId ? null : groupId
}

// ดึงกลุ่มทั้งหมดเมื่อคอมโพเนนต์ถูกติดตั้ง
onMounted(fetchGroups)

</script>

<template>
  <AdminLayout>
    <div class="bg-indigo rounded-lg mt-10 p-8 shadow-lg">
      <!-- Title -->
      <div class="text-center mb-6 space-y-4">
        <h1 class="text-3xl text-white font-bold">จัดการกลุ่มผู้ใช้งาน</h1>
        <p class="text-white text-lg">จัดการกลุ่มผู้ใช้งานที่มีบัญชีจากที่นี่</p>
      </div>

      <!-- Group List -->
      <div class="space-y-4">
        <!-- Loop through groups and display each group -->
        <div
          v-for="group in groups"
          :key="group.id"
          class="flex items-center justify-between p-4 bg-indigo-800 rounded-lg shadow-md relative"
        >
          <div class="flex items-center space-x-4">
            <img
              :src="group.profileImage || '/profileImage.jpg'"
              alt="group profile"
              class="w-12 h-12 rounded-full object-cover"
            />
            <p class="text-white text-lg font-semibold">{{ group.groupName || 'ผู้ใช้งาน' }}</p>
          </div>

          <!-- Menu Icon -->
          <button 
            @click="toggleMenu(group.id)"
            class="bg-white text-indigo-900 rounded-full p-2"
          >
            <span class="material-symbols-outlined">more_vert</span>
          </button>

          <!-- Delete Menu -->
          <div v-if="menuVisible === group.id" class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
            <button
              @click="deleteGroup(group.id)"
              class="w-full text-red-600 hover:bg-red-100 py-2 px-4 text-left rounded-lg"
            >
              ลบกลุ่มนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
