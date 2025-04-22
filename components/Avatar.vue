<template>
  <div class="avatar" :class="{ 'has-image': image }">
    <img v-if="image" :src="image" :alt="name" />
    <span v-else class="initials">{{ initials }}</span>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: null
    }
  },
  computed: {
    initials() {
      return this.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
  }
}
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #666;
}

.avatar.has-image {
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  font-size: 16px;
  line-height: 1;
}
</style> 