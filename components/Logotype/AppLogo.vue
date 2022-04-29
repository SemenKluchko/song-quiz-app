<template>
  <img
    :class="{ logo: !isQuiz }"
    src="/img/logo/logo.svg"
    alt="logotype image"
  />
</template>

<script>
export default {
  name: 'AppLogo',
  props: {
    isQuiz: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AppLogo.scss';
</style>
