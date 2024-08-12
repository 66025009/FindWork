<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="navbar bg-indigo ">
        <div class="flex-1 ml-6 ">
                <img src="/logo.jpg" alt="Logo" class=" h-70">     
        </div>
        <div class="flex-none ">
            <div class="space-x-4 mr-6">
                <RouterLink :to="{ name: 'register'}" class="btn"> เข้าร่วมเลย </RouterLink>
                <RouterLink :to="{ name: 'login'}" class="btn btn-outline btn-info "> ลงชื่อเข้าใช้ </RouterLink>
            </div>
        </div>
    </div>
    
    <slot></slot>

    <div>
        <footer></footer>
    </div>
</template>