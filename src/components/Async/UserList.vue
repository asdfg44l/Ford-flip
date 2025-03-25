<template>
  <p>{{ userList[0].email }}</p>
</template>

<script setup lang="ts">
import axios from 'axios'

const userList = ref<{ email: string }[]>([])
// axios
userList.value = (await axios.get('https://randomuser.me/api/')).data.results
</script>
