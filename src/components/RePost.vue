<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePostStore } from '@/stores/user/post'
import { useUserStore } from '@/stores/user/user'

const userStore = useUserStore()
const postStore = usePostStore()
const repostedPosts = ref([])
const loading = ref(true)

const timeAgo = (timestamp) => {
  if (!timestamp) return 'เวลาไม่ระบุ'

  let postDate
  if (timestamp instanceof Date) {
    postDate = timestamp
  } else if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
    postDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
  } else if (timestamp.toDate) {
    postDate = timestamp.toDate()
  } else {
    console.error('Invalid timestamp:', timestamp)
    return 'เวลาไม่ระบุ'
  }

  const now = new Date()
  const diffInSeconds = Math.floor((now - postDate) / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInSeconds <= 0) {
    return 'เพิ่งโพสต์'
  }

  if (diffInDays > 0) {
    return `${diffInDays} วันที่แล้ว`
  } else if (diffInHours > 0) {
    return `${diffInHours} ชั่วโมงที่แล้ว`
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} นาทีที่แล้ว`
  } else {
    return `${diffInSeconds} วินาทีที่แล้ว`
  }
}

const fetchRepostedPosts = () => {
  const userId = userStore.currentUser?.uid
  if (userId) {
    try {
      const unsubscribe = postStore.fetchRepostedPosts(userId, (posts) => {
        repostedPosts.value = posts
        loading.value = false
      })

      onUnmounted(() => {
        if (unsubscribe) unsubscribe()
      })

    } catch (error) {
      console.error('Error fetching reposted posts:', error)
      loading.value = false
    }
  } else {
    console.error('User not logged in or userId is missing')
    loading.value = false
  }
}

onMounted(() => {
  fetchRepostedPosts() // ดึงข้อมูลจาก Firebase Firestore โดยตรง
})

watch(() => userStore.currentUser?.uid, (newUserId) => {
  if (newUserId) {
    fetchRepostedPosts() // รีเฟรชข้อมูลเมื่อ userId เปลี่ยนแปลง
  }
})
</script>

<template>
    <div>
      <div v-if="loading" class="text-center">กำลังโหลด...</div>
      <div v-else>
        <div v-for="post in repostedPosts" :key="post.id" class="card w-full bg-base-100 shadow-xl mb-4">
          <div class="card-body">
            <!-- Profile Section -->
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-full overflow-hidden">
                <img :src="post.profileImage || '/profileImage.jpg'" alt="Avatar" class="w-full h-full object-cover">
              </div>
              <div>
                <div class="text-center">
                  <h1 class="text-s font-bold text-left">{{ post.name || 'Unknown User' }}
                    <span> {{ post.emoji }}</span>
                  </h1>
                </div>
                <div class="text-sm text-gray-500">{{ timeAgo(post.postTime) }}</div>
              </div>
            </div>
  
            <!-- Post Content -->
            <p class="mt-4">
              {{ post.postContent || 'เนื้อหาโพสต์ไม่ระบุ' }}
            </p>
  
            <div v-if="post.postImageUrl" class="mt-4">
              <img :src="post.postImageUrl" alt="Post Image" class="w-full h-auto" />
            </div>
  
            <div v-if="post.postVideoUrl" class="mt-4">
              <video controls :src="post.postVideoUrl" class="w-full h-auto"></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  