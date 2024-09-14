<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useUserStore } from '@/stores/user/user' 
import { useAccountStore } from '@/stores/account'
import PostCard from '@/components/PostCard.vue'
import RePost from '@/components/RePost.vue'

import UserLayout from '@/layouts/UserLayout2.vue'

const accountStore = useAccountStore()

const userStore = useUserStore();  // เพิ่มการสร้าง instance ของ userStore

const userData = computed(() => {
    return {
        profileImage: userStore.currentUser?.profileImage || '/profileImage.jpg',
        backgroundImage: userStore.currentUser?.backgroundImage || '/backgroundImage.jpg'
    }
})

</script>


<template>
    <UserLayout>
        <div class="flex bg-lightgray min-h-screen justify-center space-x-4">
            <div class="flex w-1/2 bg-white mt-4 rounded-t-2xl">
                <div class="bg-white w-full h-full rounded-2xl flex flex-col items-start ">
                    <div class="relative w-full bg-white rounded-2xl">
                        <div class="relative w-full">
                            <img :src="userData.backgroundImage"  alt="Background" class="relative w-full h-52 rounded-t-2xl object-cover" />
                        </div>
                        <div class="relative flex justify-start -mt-12 ml-10">
                            <div class="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                                <img :src="userData.profileImage" alt="Avatar" class="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                    <div v-if="userStore.loaded && userStore.currentUser" class="text-left space-y-2 ml-16">
                        <h1 class="text-l font-bold">{{ userStore.currentUser.name }}</h1>
                        <p class="text-base">{{ userStore.currentUser.companyName }}</p>
                        <p class="text-base pb-2">{{ userStore.currentUser.university }}</p>
                    </div>
                    <div class="flex flex-col items-center mt-4 ml-4">
                        <RouterLink :to="{ name: 'edit-profile'}" class="btn btn-ghost">แก้ไขข้อมูลส่วนตัว</RouterLink>
                    </div>
                    <div class="divider px-4 mt-4"></div>
                    <div class="flex flex-col space-y-4 w-full h-full"> 

                        <RePost></RePost>
                        <PostCard></PostCard>
                        
                    </div>
                </div>
            </div>
        </div>
    </UserLayout>
</template>
