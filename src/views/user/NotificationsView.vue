<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import UserLayout from '@/layouts/UserLayout2.vue'

// สร้าง state สำหรับเก็บข้อมูล noti
const notifications = ref([])

// ฟังก์ชันในการดึงข้อมูลจาก Firestore
const fetchNotifications = async () => {
  try {
    const notiCollection = collection(db, 'noti')
    const notiSnapshot = await getDocs(notiCollection)
    notifications.value = notiSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // เรียงลำดับ notifications โดยให้รายการใหม่อยู่ด้านบน
    notifications.value.sort((a, b) => b.postTime.toDate() - a.postTime.toDate())

    console.log('Notifications fetched:', notifications.value) // เพิ่ม log เพื่อดูข้อมูลที่ดึงมา
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

// ฟังก์ชันในการแปลง timestamp เป็นรูปแบบวันที่และเวลา
const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate()
  return date.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })
}

// เรียกใช้ฟังก์ชัน fetchNotifications เมื่อคอมโพเนนต์ติดตั้ง
onMounted(() => {
  fetchNotifications()
})
</script>

<template>
  <UserLayout>
    <div class="flex bg-lightgray min-h-screen justify-center p-4">
      <div class="w-full max-w-4xl bg-white mt-4 rounded-t-2xl p-4">
        <h1 class="font-bold text-lg mb-4">การแจ้งเตือน</h1>
        <div class="flex flex-col space-y-4">
          <div v-for="notification in notifications" :key="notification.id" class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="font-bold text-lg">{{ notification.title }}</h2>
            <p class="text-sm">{{ notification.content }}</p>
            <p class="text-xs text-gray-500">{{ formatTimestamp(notification.postTime) }}</p>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>
