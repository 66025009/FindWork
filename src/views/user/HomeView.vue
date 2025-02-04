<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAuth } from 'firebase/auth'
import { db, storage } from '@/firebase'
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { RouterLink} from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { useUserStore } from '@/stores/user/user'
import { useEmojiStore } from '@/stores/user/emoji'
import UserLayout from '@/layouts/UserLayout2.vue'
import PostCardHome from '@/components/PostCardHome.vue'
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css'

const accountStore = useAccountStore()
const userStore = useUserStore()
const emojiStore = useEmojiStore()
const auth = getAuth()

const showPost = ref(false)
const showImageUpload = ref(false)
const imagePreview = ref(null)
const isVideo = ref(false)
const news = ref([])
const expandedNewsId = ref(null) 
const showEmojiDropdown = ref(false)

const postData = ref({
  content: '',
  imageUrl: '',
  videoUrl: '',
  emoji: ''
})

const userData = computed(() => ({
  profileImage: userStore.currentUser?.profileImage || '/profileImage.jpg',
  backgroundImage: userStore.currentUser?.backgroundImage || '/backgroundImage.jpg'
}))

const handleFile = async (event) => {
  const file = event.target.files[0]
  if (file) {
    const previewURL = URL.createObjectURL(file)
    imagePreview.value = previewURL
    isVideo.value = file.type.startsWith('video/')

    const fileExtension = file.name.split('.').pop().toLowerCase()
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)
    const isVideoFile = ['mp4', 'mov', 'avi'].includes(fileExtension)

    if (!isImage && !isVideoFile) {
      console.error('Invalid file type. Only images and videos are allowed.')
      return
    }

    const filePath = `post/${accountStore.user.uid}/${Date.now()}_${file.name}`
    const fileRef = storageRef(storage, filePath)

    try {
      const snapshot = await uploadBytes(fileRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      if (file.type.startsWith('video/')) {
        postData.value.videoUrl = downloadURL
        postData.value.imageUrl = ''
      } else {
        postData.value.imageUrl = downloadURL
        postData.value.videoUrl = ''
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }
}

const submitPost = async () => {
  if (postData.value.content.trim() === '') {
    console.error('Content cannot be empty.')
    return
  }

  try {
    if (!userStore.currentUser || !userStore.currentUser.uid) {
      console.error('User is not authenticated or UID is missing.')
      return
    }

    await addDoc(collection(db, 'posts'), {
      profileImage: userStore.currentUser.profileImage,
      name: userStore.currentUser.name,
      postTime: Timestamp.fromDate(new Date()),
      content: postData.value.content,
      imageUrl: postData.value.imageUrl,
      videoUrl: postData.value.videoUrl,
      emoji: postData.value.emoji,
      uid: userStore.currentUser.uid, 
    })

    postData.value = { content: '', imageUrl: '', videoUrl: '', emoji: '' }
    imagePreview.value = null
    showPost.value = false
  } catch (error) {
    console.error('Error creating post:', error)
  }
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate()
  return date.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })
}

const fetchNews = async () => {
  const newsRef = collection(db, 'news')
  const newsSnap = await getDocs(newsRef)
  return newsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

const toggleShowMore = (id) => {
  expandedNewsId.value = expandedNewsId.value === id ? null : id
}

onMounted(async () => {
  try {
    news.value = await fetchNews()
  } catch (error) {
    console.error('Error fetching news:', error)
  }

  try {
    const user = auth.currentUser
    if (user) {
      await userStore.loadUserByUid(user.uid)
      console.log('User data loaded:', userStore.currentUser)
    } else {
      console.error('No user is logged in.')
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
})

const removeImagePreview = () => {
  imagePreview.value = null
  isVideo.value = false
}

const hasEducation = computed(() => userStore.currentUser && userStore.currentUser.university)

const toggleEmojiDropdown = () => {
  showEmojiDropdown.value = !showEmojiDropdown.value
}

const selectEmoji = (emoji) => {
  postData.value.emoji = emoji.i; // เก็บเฉพาะอิโมจิที่เลือก
  showEmojiDropdown.value = false;
}


</script>

<template>
  <UserLayout>
    <div class="flex bg-lightgray min-h-screen justify-center space-x-4">
      <!-- ส่วนที่ 1 -->
      <div class="flex flex-col space-y-4 w-1/5 h-full sticky top-0">
        <div class="bg-white h-full rounded-2xl mt-4">
          <div class="relative w-full bg-white rounded-2xl">
            <div class="relative w-full">
              <img :src="userData.backgroundImage" alt="Background" class="relative w-full h-32 rounded-t-2xl object-cover"/>
            </div>
            <div class="relative flex justify-center -mt-12">
              <div class="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                <img :src="userData.profileImage" alt="Avatar" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div v-if="userStore.loaded && userStore.currentUser" class="text-center space-y-2">
            <h1 class="text-l font-bold">{{ userStore.currentUser.name }}</h1>
            <p class="text-base">{{ userStore.currentUser.companyName }}</p>
            <p class="text-base pb-2">{{ userStore.currentUser.university }}</p>
          </div>

          <div v-if="!hasEducation" class="my-6 mx-4">
            <RouterLink :to="{ name: 'experience-work'}" class="w-full py-2 border-2 border-dashed border-gray-400 text-gray-500 rounded-lg">
              + ประสบการณ์
            </RouterLink>
          </div>
        </div>

        <div class="flex flex-col bg-white h-full rounded-2xl">
          <div class="mt-8 ml-4">
            <h1 class="font-bold">คนรู้จัก</h1>
            <p>ขยายเครือข่ายของคุณ</p>
          </div>
          <div class="divider px-4"></div>
          <div class="flex flex-col mb-8 items-start">
            <RouterLink :to="{ name: 'network'}" class="btn btn-ghost flex items-center">    
              <span class="material-symbols-outlined">person</span>
              <h1 class="font-bold text-left ml-2">บุคคลที่คุณรู้จัก</h1>
            </RouterLink>
            <RouterLink :to="{ name: 'network'}" class="btn btn-ghost flex items-center">
              <span class="material-symbols-outlined">Group</span>
              <h1 class="font-bold text-left ml-2">กลุ่ม</h1>
            </RouterLink>
          </div>
        </div>
      </div>

     <!-- ส่วนที่ 2 -->
     <div class="flex flex-col space-y-4 w-2/4 h-full">
        <div class="bg-white h-full rounded-2xl mt-4">
          <div class="flex justify-center items-center w-full bg-white rounded-2xl space-x-4 pt-6">
            <div class="w-16 h-16 rounded-full border-4 border-lightgray overflow-hidden">
              <img :src="userData.profileImage" alt="Avatar" class="w-full h-full" />
            </div>
            <button @click="showPost = true" class="input input-bordered w-[500px] flex items-center gap-2">
              <span class="material-symbols-outlined opacity-70">edit_square</span>
              <input type="text" class="grow" placeholder="คุณคิดอะไรอยู่" />
            </button>
          </div>
          <div class="divider px-4"></div>
          <div class="flex flew-rows justify-center items-center space-x-12 pb-6">
            <button @click="showPost = true" class="flex flew-rows justify-center items-center space-x-2">
              <span class="material-symbols-outlined text-blue-400">image</span>
              <h1 class="text-blue-400">รูปภาพ</h1>
            </button>
            <button @click="showPost = true" class="flex flew-rows justify-center items-center space-x-2">
              <span class="material-symbols-outlined text-blue-400">video_camera_front</span>
              <h1 class="text-blue-400">วิดีโอ</h1>
            </button>
            <button @click="showPost = true" class="flex flew-rows justify-center items-center space-x-2">
              <span class="material-symbols-outlined text-blue-400">emoji_emotions</span>
              <h1 class="text-blue-400">อีโมจิ</h1>
            </button>
          </div>
        </div>

        <!-- แสดงโพสต์ -->
        <PostCardHome></PostCardHome>
      </div>

      <!-- ส่วนที่ 3 -->
      <div class="bg-white w-1/5 h-full rounded-2xl mt-4 sticky top-4">
        <div class="flex flex-col bg-white h-full rounded-2xl overflow-hidden">
          <div class="mt-8 ml-4">
            <h1 class="font-bold text-lg">ข่าวสาร</h1>
            <p>เรื่องราวยอดนิยม</p>
          </div>
          <div class="divider px-4"></div>
          <!-- เพิ่ม max-height และ overflow-auto เพื่อให้มีสกอร์เลื่อน -->
          <div class="flex flex-col items-start mb-8 mx-4 overflow-auto" style="max-height: 20rem;">
            <div v-for="item in news" :key="item.id" class="mb-4">
              <h2 class="font-bold text-lg">{{ item.title }}</h2>
              <p :class="['text-sm', { 'line-clamp-2': !expandedNewsId || expandedNewsId !== item.id }]">
                {{ item.content }}
              </p>
              <p v-if="item.content.length > 100" @click="toggleShowMore(item.id)" class="text-blue-500 cursor-pointer">
                {{ expandedNewsId === item.id ? 'แสดงน้อยลง' : 'แสดงเพิ่มเติม' }}
              </p>
              <p class="text-xs text-gray-500">{{ formatTimestamp(item.postTime) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade" appear>
          <div v-if="showPost" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-2xl p-6 w-2/5">
              <h1 class="text-lg font-bold text-center">สร้างโพสต์</h1>

              <div class="flex justify-end">
                <button @click="showPost = false" class="text-red-500">ปิด</button>
              </div>
              <div class="flex items-center space-x-4 mb-4">
        <div class="w-16 h-16 rounded-full overflow-hidden">
          <img :src="userData.profileImage" alt="Avatar" class="w-full h-full">
        </div>
        <div v-if="userStore.loaded && userStore.currentUser" class="text-center space-y-2">
          <h1 class="text-l font-bold">
  {{ userStore.currentUser.name }} 
  <span v-if="postData.emoji">
    รู้สึก<span v-html="postData.emoji"></span> <!-- แสดงเฉพาะอิโมจิ -->
  </span>
</h1>
        </div>
      </div>

              <div class="my-4">
                <textarea
                  v-model="postData.content"
                  class="textarea textarea-bordered w-full"
                  rows="4"
                  placeholder="เขียนข้อความ..."
                ></textarea>
              </div>

              <div v-if="imagePreview" class="relative mt-4">
            <img v-if="!isVideo" :src="imagePreview" alt="Image Preview" class="w-full h-auto rounded-lg">
            <video v-if="isVideo" :src="imagePreview" controls class="w-full h-auto rounded-lg"></video>
            <button @click="removeImagePreview" class="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

              <div class="flex items-center space-x-2 my-4">
  <button @click="toggleEmojiDropdown" class="flex flew-rows justify-center items-center">
    <span class="material-symbols-outlined text-blue-400">emoji_emotions</span>
  </button>
  <input type="file" @change="handleFile" accept="image/*, video/*" class="my-4"/>
</div>


              <button @click="submitPost" class="btn btn-outline btn-accent w-full text-white">โพสต์</button>

              <!-- Emoji Picker -->
<div v-if="showEmojiDropdown" class="absolute right-60 top-60">
  <EmojiPicker @select="selectEmoji" />

</div>

            </div>
          </div>
        </transition>
  </UserLayout>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
