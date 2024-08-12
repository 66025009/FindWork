<script setup>
import { ref } from 'vue';

import { RouterLink } from 'vue-router'

</script>

<template>
  <div
    class="hero min-h-screen bg-contain relative"
    style="background-image: url(/bg.jpg);">
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <div class="relative flex items-center justify-center h-5/6 w-1/3 bg-gradient-to-b from-[#e1ca9d] via-[#ec61cd] to-[#715ded] rounded-3xl">
      <div class="relative  flex items-center justify-center bg-base-200 p-2 rounded-3xl h-[650px] w-[500px]">
        <div class="hero-content text-center">
          <div class="max-w-md mx-auto">
            <h1 class="text-xl font-bold"> FindWork </h1>
            <h2 class="text-l font-normal"> คอยติดตามข้อมูลล่าสุดในโลก <br> แห่งอาชีพของคุณ </h2>
            <div class="space-y-2 pt-6"> 
              <label class="input input-bordered flex items-center gap-2 w-96">
                Email
                <input type="text" class="grow" placeholder="email@gmail.com" />
              </label>
              <label class="input input-bordered flex items-center gap-2">
                Password
                <input type="password" class="grow" value="">
              </label>
              <div class="flex justify-between text-l font-bold py-3">
                <RouterLink :to="{ name: 'register'}" class="text-left text-blue">ลงทะเบียน</RouterLink>
                <RouterLink :to="{ name: 'forget'}" class="text-right text-sky">ลืมรหัสผ่าน</RouterLink>
              </div>
              <RouterLink :to="{ name: 'home'}" class="btn bg-green hover:bg-greenhover text-l font-bold text-white w-96 p-4">ลงชื่อเข้าใช้</RouterLink>
            </div>
            <div class="divider divider-neutral py-3 ">หรือ</div>
            <div class="flex justify-center gap-16 pt-4">
                <img src="/G.png" alt="picture" class="h-14 w-14">
                <img src="/F.png" alt="picture" class="h-[52px] w-[52px]">
                <img src="/L.png" alt="picture" class="h-[52px] w-[52px]">
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>