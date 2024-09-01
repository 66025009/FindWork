  <script setup>
  import { onMounted } from 'vue'
  import { useAccountStore } from '@/stores/account'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const accountStore = useAccountStore()
  const router = useRouter()
  
  const handleLineLogin = async (accessToken) => {
    try {
      await accountStore.signInWithLine(accessToken)
      console.log('User logged in, redirecting to home...')
      router.replace({ name: 'home' }).catch(err => {
        console.error('Router replace error:', err)
      })
    } catch (error) {
      console.error('Error during LINE login:', error)
    }
  }
  
  onMounted(async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
  
    if (code) {
      try {
        const response = await axios.post('https://api.line.me/oauth2/v2.1/token', new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'http://localhost:5177/callback',
          client_id: '2006078548',
          client_secret: '6dd6b9f7d391c7bd462142e30d80c0ea'
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
  
        const { access_token } = response.data
        await handleLineLogin(access_token)
      } catch (error) {
        console.error('Error exchanging code for access token:', error)
      }
    } else {
      console.error('Authorization code not found')
    }
  })
  </script>

<template>
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">กำลังเข้าสู่ระบบ</h1>
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    </div>
  </template>
  