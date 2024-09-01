<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAccountStore } from '@/stores/account'

const router = useRouter()
const route = useRoute()
const accountStore = useAccountStore()

const pageData = [
  {
    name: 'หน้าหลัก',
    route: '/admin/home',
  },
  {
    name: 'ฟอร์ม',
    route: '/admin/form',
  },
  {
    name: 'บุคลากร',
    route: '/admin/people',
  }
]

const managementData = [
  {
    name: 'บัญชีผู้ใช้งาน',
    route: '/admin/account-user',
  },
  {
    name: 'ข้อมูลข่าวสาร',
    route: '/admin/information',
  },
  {
    name: 'กลุ่มคอมมูนิตี้',
    route: '/admin/community',
  },
]

const currentPath = ref(route.path)

onMounted(() => {
  currentPath.value = route.path
})

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
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-5 w-52 p-2 drop-shadow-lg">
        <div tabindex="0" role="button" class="btn-circle avatar flex items-center w-full p-5 mt-2">
          <div class="w-12 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
          <span class="ml-4">ชื่อ-นามสกุล</span>
        </div>

        <li class="p-4">
          <a class="btn btn-outline btn-primary">โปรไฟล์</a>
        </li>

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
