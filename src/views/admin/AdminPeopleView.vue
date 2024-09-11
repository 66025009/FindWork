<script setup>
import { ref, onMounted } from 'vue'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '@/firebase' // ปรับเส้นทางนี้ให้ตรงกับการตั้งค่าของคุณ
import AdminLayout from '@/layouts/AdminLayout.vue'

const admins = ref([]) // ตัวแปรเพื่อเก็บข้อมูลแอดมิน

// ฟังก์ชันสำหรับดึงข้อมูลจาก Firestore
const fetchAdmins = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'admin'))
    admins.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching admin data:', error)
  }
}

onMounted(() => {
  fetchAdmins() // เรียกใช้ฟังก์ชันเมื่อคอมโพเนนต์โหลด
})
</script>

<template>
    <AdminLayout>
      <div class="overflow-x-auto mt-10">
        <table class="table">
          <thead>
            <tr class="text-lg font-bold">
              <th></th>
              <th>รูปโปรไฟล์</th> <!-- เพิ่มคอลัมน์สำหรับรูปโปรไฟล์ -->
              <th>ชื่อ</th>
              <th>ตำแหน่งงาน</th>
              <th>อีเมล</th>
            </tr>
          </thead>
          <tbody>
            <!-- ใช้ v-for เพื่อวนลูปข้อมูลแอดมินและแสดงในตาราง -->
            <tr v-for="(admin, index) in admins" :key="admin.id" class="text-base"> 
              <th>{{ index + 1 }}</th>
              
              <!-- แสดงรูปโปรไฟล์ -->
              <td>
                <img v-if="admin.profileImageUrl" :src="admin.profileImageUrl" alt="Profile Image" class="w-12 h-12 object-cover rounded-full border border-gray-300"/>
              </td>
              <td>{{ admin.name }}</td>
              <td>{{ admin.job }}</td>
              <td>{{ admin.email }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
</template>
