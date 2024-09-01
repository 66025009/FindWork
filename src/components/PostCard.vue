<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { usePostStore } from '@/stores/user/post'
import { useUserStore } from '@/stores/user/user'

const userStore = useUserStore()
const postStore = usePostStore()
const posts = ref([])

const likedPosts = ref(new Set()) 
const repostedPosts = ref(new Set()) 
const commentStates = ref(new Map()) 
const newComment = ref('')

// ฟังก์ชันสำหรับคำนวณเวลาที่โพสต์
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

const toggleLike = (postId) => {
  if (likedPosts.value.has(postId)) {
    likedPosts.value.delete(postId)
  } else {
    likedPosts.value.add(postId)
  }
  saveStatusToStorage()
}

const toggleRepost = (postId) => {
  if (repostedPosts.value.has(postId)) {
    repostedPosts.value.delete(postId)
  } else {
    repostedPosts.value.add(postId)
  }
  saveStatusToStorage()
}

const addComment = async (postId) => {
  if (newComment.value.trim()) {
    try {
      await postStore.createComment(postId, { content: newComment.value });
      newComment.value = '';
      await postStore.fetchComments(postId);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }
}

const convertToTimestamp = (timestamp) => {
  if (timestamp instanceof Date) {
    return timestamp.getTime()
  } else if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
    return timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  } else if (timestamp.toDate) {
    return timestamp.toDate().getTime()
  } else {
    console.error('Invalid timestamp:', timestamp)
    return 0
  }
}

const loadStatusFromStorage = () => {
  const liked = localStorage.getItem('likedPosts')
  const reposted = localStorage.getItem('repostedPosts')
  if (liked) {
    likedPosts.value = new Set(JSON.parse(liked))
  }
  if (reposted) {
    repostedPosts.value = new Set(JSON.parse(reposted))
  }
}

const filterPostsByUid = (posts) => {
  return posts.filter(post => post.userId === userStore.currentUser?.id)
}

onMounted(async () => {
  loadStatusFromStorage();
  await postStore.fetchPostsByCurrentUser(userStore.currentUser?.id); // ส่ง userId เพื่อกรองโพสต์
  posts.value = postStore.posts
    .slice()
    .sort((a, b) => convertToTimestamp(b.postTime) - convertToTimestamp(a.postTime));
  
  await postStore.updateOldPostsField(); // เรียกใช้ฟังก์ชัน updateOldPostsField

  // console.log('โพสต์ทั้งหมดของผู้ใช้:', posts.value);
});


watch(() => postStore.posts, (newPosts) => {
  posts.value = filterPostsByUid(newPosts)
    .slice()
    .sort((a, b) => convertToTimestamp(b.postTime) - convertToTimestamp(a.postTime))
}, { immediate: true })

watch(likedPosts, () => {
  saveStatusToStorage()
})

watch(repostedPosts, () => {
  saveStatusToStorage()
})

const toggleComments = (postId) => {
  if (commentStates.value.has(postId)) {
    commentStates.value.delete(postId)
  } else {
    commentStates.value.set(postId, true)
  }
}

const saveStatusToStorage = () => {
  localStorage.setItem('likedPosts', JSON.stringify(Array.from(likedPosts.value)))
  localStorage.setItem('repostedPosts', JSON.stringify(Array.from(repostedPosts.value)))
}

</script>



<template>
  <div>
    <div v-for="post in posts" :key="post.id" class="card w-full bg-base-100 shadow-xl mb-4">
      <div class="card-body">
        <!-- Profile Section -->
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 rounded-full overflow-hidden">
            <img :src="post.profileImage || '/profileImage.jpg'" alt="Avatar" class="w-full h-full object-cover">
          </div>
          <div>
            <div class="text-center">
              <h1 class="text-s font-bold text-left">{{ post.name || 'Unknown User' }}</h1>
            </div>
            <div class="text-sm text-gray-500">{{ timeAgo(post.postTime) }}</div>
          </div>
        </div>

        <!-- Post Content -->
        <p class="mt-4">
          {{ post.content || 'เนื้อหาโพสต์ไม่ระบุ' }}
        </p>

        <div v-if="post.imageUrl" class="mt-4">
          <img :src="post.imageUrl" alt="Post Image" class="w-full h-auto">
        </div>

        <div v-if="post.videoUrl" class="mt-4">
          <video controls :src="post.videoUrl" class="w-full h-auto"></video>
        </div>

        <div class="divider px-4"></div>

        <!-- Interaction Section -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <button 
              @click="toggleLike(post.id)"
              :class="{'btn btn-ghost flex items-center btn-blue': likedPosts.has(post.id), 'btn btn-ghost flex items-center': !likedPosts.has(post.id)}"
            >
              <span class="material-symbols-outlined">thumb_up</span>
              <span class="font-bold text-left ml-2">ถูกใจ</span>
            </button>

            <button 
              @click="toggleRepost(post.id)"
              :class="{'btn btn-ghost flex items-center btn-green': repostedPosts.has(post.id), 'btn btn-ghost flex items-center': !repostedPosts.has(post.id)}"
            >
              <span class="material-symbols-outlined">repeat</span>
              <span class="font-bold text-left ml-2">รีโพสต์</span>
            </button>

            <button @click="toggleComments(post.id)" class="btn btn-ghost flex items-center">
              <span class="material-symbols-outlined">chat</span>
              <span class="font-bold text-left ml-2">คอมเมนต์</span>
            </button>
          </div>
          <div>
            <span>สถานะโพสต์</span>
          </div>
        </div>

        <transition name="fade">
          <div v-if="commentStates.get(post.id)" class="mt-4 bg-gray-100 h-full p-4 rounded-md">
            <p class="font-bold">ความคิดเห็น</p>

            <!-- ส่วนของความคิดเห็น -->
            <div v-for="comment in postStore.comments.get(post.id) || []" :key="comment.id" class="flex items-center space-x-4 mb-2">
                <div class="w-12 h-12 rounded-full overflow-hidden">
                  <img :src="comment.profileImage || '/profileImage.jpg'" alt="Avatar" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 p-2 bg-gray-200 rounded-md">
                  <div class="text-left">
                    <h1 class="text-s font-bold text-left">{{ comment.name || 'Unknown User' }}</h1>
                  </div>
                  <p class="text-sm">{{ comment.content }}</p>
                </div>
              </div>

            <!-- แบบฟอร์มเพิ่มความคิดเห็น -->
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-full overflow-hidden">
                <img :src="userStore.currentUser?.profileImage || '/profileImage.jpg'" alt="Avatar" class="w-full h-full object-cover">
              </div>
              <div class="flex items-center w-full bg-gray-200 p-2 rounded-md">
                <input v-model="newComment" placeholder="เขียนความคิดเห็น..." class="flex-1 bg-gray-200 p-2 rounded-md">
                <button @click="addComment(post.id)" class="material-symbols-outlined">send</button>
              </div>
            </div>
          </div>
        </transition>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-blue {
  color: rgb(5, 139, 242);
}

.btn-green {
  color: rgb(6, 173, 6);
}

.material-symbols-outlined {
  font-size: 1.5rem;
}
</style>
