<script setup>
import { ref } from 'vue';
import UserLayout from '@/layouts/UserLayout2.vue';

const showExperience = ref(false);
const showPost = ref(false);
</script>

<template>
    <UserLayout>
        <div class="flex bg-lightgray min-h-screen justify-center space-x-4">
            <!-- ส่วนที่ 1 -->
            <div class="flex flex-col space-y-4 w-1/5 h-full sticky top-0"> 
                <div class="bg-white h-full rounded-2xl mt-4">
                    <div class="relative w-full bg-white rounded-2xl">
                        <div class="relative w-full">
                            <img src="/Frame 8.png" alt="Background" class="relative w-full h-full rounded-t-2xl object-cover">
                        </div>
                        <div class="relative flex justify-center -mt-12">
                            <div class="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" class="w-full h-full object-cover">
                            </div>
                        </div>
                    </div>
                    <div class="text-center font-bold mt-2">ชื่อ-นามสกุล</div>
                    <div class="my-6 mx-4">
                        <button @click="showExperience = true" class="w-full py-2 border-2 border-dashed border-gray-400 text-gray-500 rounded-lg">
                            + ประสบการณ์
                        </button>
                    </div>
                </div>

                <div class="flex flex-col bg-white h-full rounded-2xl">
                    <div class="mt-8 ml-4 ">
                        <h1 class="font-bold">คนรู้จัก</h1>
                        <p>ขยายเครือข่ายของคุณ</p>
                    </div>
                    <div class="divider px-4"></div>
                    <div class="flex flex-col mb-8 items-start">
                        <button class="btn btn-ghost flex items-center">
                            <span class="material-symbols-outlined">Bookmark</span>
                            <h1 class="font-bold text-left ml-2">รายการที่บันทึกแล้ว</h1>
                        </button>
                        <button class="btn btn-ghost flex items-center ">
                            <span class="material-symbols-outlined">Group</span>
                            <h1 class="font-bold text-left ml-2">กลุ่ม</h1>
                        </button>
                    </div>
                </div>
            </div>
             <!-- ส่วนที่ 2 -->
            <div class="flex flex-col space-y-4 w-2/4 h-full"> 
                <div class="bg-white h-full rounded-2xl mt-4">
                    <div class="flex justify-center items-center w-full bg-white rounded-2xl space-x-4 pt-6">
                        <div class="w-16 h-16 rounded-full border-4 border-lightgray overflow-hidden">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" class="w-full h-full">
                        </div>
                        <button @click="showPost = true" class="input input-bordered w-[500px] flex items-center gap-2">
                            <span class="material-symbols-outlined opacity-70">edit_square</span>
                            <input type="text" class="grow" placeholder="คุณคิดอะไรอยู่" />
                        </button>
                    </div>
                    <div class="divider px-4"></div>
                    <div class="flex flew-rows justify-center items-center space-x-12 pb-6">
                        <button @click="showPost = true" class="flex flew-rows justify-center items-center space-x-2">
                            <span class="material-symbols-outlined" style="color: #1A73E8; font-size: 40px;">imagesmode</span>
                            <p>รูปภาพ</p>
                        </button>
                        <button @click="showPost = true" class="flex flew-rows justify-center items-center space-x-2">
                            <span class="material-symbols-outlined" style="color: #F27733; font-size: 40px;">smart_display</span>
                            <p>วิดีโอ</p>
                        </button>
                        <button @click="showPost = true" class="flex flew-rows justify-center items-center space-x-2">
                            <span class="material-symbols-outlined" style="color: #F7C02B; font-size: 40px;">sentiment_satisfied</span>
                            <p>ความรู้สึก</p>
                        </button>
                    </div>

                </div>

                <div class="flex flex-col bg-white h-full rounded-2xl">
                    <div class="mt-8 ml-4 ">
                        <h1 class="font-bold">คนรู้จัก</h1>
                        <p>ขยายเครือข่ายของคุณ</p>
                    </div>
                    <div class="divider px-4"></div>
                    <div class="flex flex-col mb-8 items-start">
                        <button class="btn btn-ghost flex items-center">
                            <span class="material-symbols-outlined">Bookmark</span>
                            <h1 class="font-bold text-left ml-2">รายการที่บันทึกแล้ว</h1>
                        </button>
                        <button class="btn btn-ghost flex items-center ">
                            <span class="material-symbols-outlined">Group</span>
                            <h1 class="font-bold text-left ml-2">กลุ่ม</h1>
                        </button>
                    </div>
                </div>
                <div class="flex flex-col bg-white h-full rounded-2xl">
                    <div class="mt-8 ml-4 ">
                        <h1 class="font-bold">คนรู้จัก</h1>
                        <p>ขยายเครือข่ายของคุณ</p>
                    </div>
                    <div class="divider px-4"></div>
                    <div class="flex flex-col mb-8 items-start">
                        <button class="btn btn-ghost flex items-center">
                            <span class="material-symbols-outlined">Bookmark</span>
                            <h1 class="font-bold text-left ml-2">รายการที่บันทึกแล้ว</h1>
                        </button>
                        <button class="btn btn-ghost flex items-center ">
                            <span class="material-symbols-outlined">Group</span>
                            <h1 class="font-bold text-left ml-2">กลุ่ม</h1>
                        </button>
                    </div>
                </div>
                <div class="flex flex-col bg-white h-full rounded-2xl">
                    <div class="mt-8 ml-4 ">
                        <h1 class="font-bold">คนรู้จัก</h1>
                        <p>ขยายเครือข่ายของคุณ</p>
                    </div>
                    <div class="divider px-4"></div>
                    <div class="flex flex-col mb-8 items-start">
                        <button class="btn btn-ghost flex items-center">
                            <span class="material-symbols-outlined">Bookmark</span>
                            <h1 class="font-bold text-left ml-2">รายการที่บันทึกแล้ว</h1>
                        </button>
                        <button class="btn btn-ghost flex items-center ">
                            <span class="material-symbols-outlined">Group</span>
                            <h1 class="font-bold text-left ml-2">กลุ่ม</h1>
                        </button>
                    </div>
                </div>
                <div class="flex flex-col bg-white h-full rounded-2xl">
                    <div class="mt-8 ml-4 ">
                        <h1 class="font-bold">คนรู้จัก</h1>
                        <p>ขยายเครือข่ายของคุณ</p>
                    </div>
                    <div class="divider px-4"></div>
                    <div class="flex flex-col mb-8 items-start">
                        <button class="btn btn-ghost flex items-center">
                            <span class="material-symbols-outlined">Bookmark</span>
                            <h1 class="font-bold text-left ml-2">รายการที่บันทึกแล้ว</h1>
                        </button>
                        <button class="btn btn-ghost flex items-center ">
                            <span class="material-symbols-outlined">Group</span>
                            <h1 class="font-bold text-left ml-2">กลุ่ม</h1>
                        </button>
                    </div>
                </div>
                <div class="flex flex-col bg-white h-full rounded-2xl">
                    <div class="mt-8 ml-4 ">
                        <h1 class="font-bold">คนรู้จัก</h1>
                        <p>ขยายเครือข่ายของคุณ</p>
                    </div>
                    <div class="divider px-4"></div>
                    <div class="flex flex-col mb-8 items-start">
                        <button class="btn btn-ghost flex items-center">
                            <span class="material-symbols-outlined">Bookmark</span>
                            <h1 class="font-bold text-left ml-2">รายการที่บันทึกแล้ว</h1>
                        </button>
                        <button class="btn btn-ghost flex items-center ">
                            <span class="material-symbols-outlined">Group</span>
                            <h1 class="font-bold text-left ml-2">กลุ่ม</h1>
                        </button>
                    </div>
                </div>
                
            </div>
             <!-- ส่วนที่ 3 -->
            <div class="bg-white w-1/5 h-full rounded-2xl mt-4 sticky top-4">
                <div class="flex flex-col bg-white h-full rounded-2xl">
                    <div class="mt-8 ml-4 ">
                        <h1 class="font-bold text-l">ข่าวสาร</h1>
                        <p>เรื่องราวยอดนิยม</p>
                    </div>
                    <div class="divider px-4"></div>
                    <div class="flex flex-col items-start mb-8 mx-4">
                        ข่าวสาร
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showExperience" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <div class="relative bg-white w-1/3 p-8 rounded-lg shadow-lg">
                <button @click="showExperience = false" class="absolute top-2 right-2 text-gray-500 hover:text-red-400">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <h2 class="text-xl font-bold mb-4">ประสบการณ์</h2>
                <p>นี่คือเนื้อหาแผงลอยที่แสดงขึ้นเมื่อกดปุ่มประสบการณ์</p>
            </div>
        </div>

        <div v-if="showPost" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <div class="relative bg-white w-1/3 p-8 rounded-lg shadow-lg">
                <button @click="showPost = false" class="absolute top-2 right-2 text-gray-500 hover:text-red-400">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <h2 class="text-xl font-bold mb-4">โพสต์</h2>
                <p>นี่คือเนื้อหาแผงลอยที่แสดงขึ้นเมื่อกดโพสต์</p>
            </div>>

        </div>
    </UserLayout>
</template>
