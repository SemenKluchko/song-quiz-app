<template>
  <button class="button" v-bind="$attrs" v-on="$listeners">
    <span class="button__text">{{ text }}</span>
    <span class="button__arrow">
      <img src="/img/btn/arrow.svg" alt="arrow image" />
    </span>
  </button>
</template>

<script>
export default {
  name: 'UiButton',
  props: {
    text: {
      type: [String, Number],
      default: '',
      required: true,
    },
  },
}
</script>


<style lang="scss" scoped>
@import 'UiButton.scss';
</style>
