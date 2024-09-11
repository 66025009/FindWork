<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'

const router = useRouter()
const route = useRoute()
const accountStore = useAccountStore()

const pageData = [
  { name: 'หน้าหลัก', route: '/admin/home' },
  { name: 'ฟอร์ม', route: '/admin/form' },
  { name: 'บุคลากร', route: '/admin/people' }
]

const managementData = [
  { name: 'บัญชีผู้ใช้งาน', route: '/admin/account-user' },
  { name: 'ข้อมูลข่าวสาร', route: '/admin/information' },
  { name: 'กลุ่มคอมมูนิตี้', route: '/admin/community' }
]

const currentPath = ref(route.path)
const profileImageUrl = ref('')
const adminName = ref('')

onMounted(async () => {
  currentPath.value = route.path
  await fetchAdminProfile()
})

const fetchAdminProfile = async () => {
  try {
    const user = accountStore.user
    if (user) {
      const docRef = doc(db, 'admin', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const adminData = docSnap.data()
        profileImageUrl.value = adminData.profileImageUrl
        adminName.value = adminData.name
      }
    }
  } catch (error) {
    console.error('Error fetching admin profile:', error)
  }
}

const logout = async () => {
  try {
    await accountStore.logout()
    router.push({ name: 'ad-login' })
  } catch (error) {
    console.log('error', error)
  }
}
</script>

<template>
  <div class="navbar bg-indigo">
    <div class="flex-1 ml-6">
      <a href="/admin/home">
        <img src="/logo.jpg" alt="Logo" class="h-70">
      </a>
    </div>
    <div class="flex-none"></div>
    <div class="dropdown dropdown-end px-10">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
        <div class="w-12 rounded-full">
          <img :src="profileImageUrl" alt="Profile" />
        </div>
      </div>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-5 w-52 p-2 drop-shadow-lg">
        <div tabindex="0" role="button" class="btn-circle avatar flex items-center w-full p-5 mt-2">
          <div class="w-12 rounded-full">
            <img :src="profileImageUrl" alt="Profile" />
          </div>
          <span class="ml-4">{{ adminName }}</span>
        </div>

        <div class="p-2">
        </div>

        <ul class="font-bold border-t-2 pt-2 pl-2">
          <summary>จัดการ</summary>
          <ul class="font-normal">
            <li v-for="page in managementData" :key="page.name">
              <RouterLink :to="page.route" :class="currentPath === page.route ? 'active' : ''">
                {{ page.name }}
              </RouterLink>
            </li>
          </ul>
        </ul>

        <li class="text-red-600 border-t-2 pt-2">
          <button @click="logout"><a>ออกจากระบบ</a></button>
        </li>
      </ul>
    </div>
  </div>

  <div class="drawer drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content mx-4">
      <slot></slot>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay"></label>
      <ul class="menu p-4 w-60 h-full bg-[#DEE0E2] text-base-content text-l font-bold text-indigo space-y-4">
        <li v-for="page in pageData" :key="page.name">
          <RouterLink :to="page.route" :class="currentPath === page.route ? 'active' : ''">
            {{ page.name }}
          </RouterLink>
        </li>
        <li>
          <details open>
            <summary>จัดการ</summary>
            <ul class="pt-2 space-y-2 text-base">
              <li v-for="page in managementData" :key="page.name">
                <RouterLink :to="page.route" :class="currentPath === page.route ? 'active' : ''">
                  {{ page.name }}
                </RouterLink>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>

  <div>
    <footer></footer>
  </div>
</template>
