<template>
  <div class="quiz__progress progress">
    <div class="progress__line">
      <div ref="fill" class="progress__fill"></div>
      <div ref="answ" class="progress__answered"></div>
    </div>
    <ul class="progress__bar">
      <li class="progress__item">
        <h6 class="h6">Jazz</h6>
      </li>
      <li class="progress__item">
        <img src="/img/btn/arrow.svg" alt="arrow image" />
      </li>
      <li class="progress__item">
        <h6 class="h6">Rock</h6>
      </li>
      <li class="progress__item">
        <img src="/img/btn/arrow.svg" alt="arrow image" />
      </li>
      <li class="progress__item">
        <h6 class="h6">Pop</h6>
      </li>
      <li class="progress__item">
        <img src="/img/btn/arrow.svg" alt="arrow image" />
      </li>
      <li class="progress__item">
        <h6 class="h6">Soundtrack</h6>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    filled: {
      type: [String, Number],
      default: '',
      required: true,
    },
    answered: {
      type: [String, Number],
      default: '',
      required: true,
    },
  },
  watch: {
    answered() {
      this.$nextTick(() => {
        this.$refs.answ.style.width = this.answered
      })
    },
    filled() {
      this.$nextTick(() => {
        this.$refs.fill.style.width = this.filled
      })
    },
    deep: true,
    immediate: true,
  },
}
</script>

<style lang="scss" scoped>
@import 'ProgressBar.scss';
</style>
