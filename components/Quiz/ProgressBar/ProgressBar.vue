<template>
  <div class="quiz__progress progress">
    <div class="progress__line">
      <div ref="fill" class="progress__fill"></div>
      <div ref="answ" class="progress__answered"></div>
    </div>
    <ul class="progress__bar">
      <li class="progress__item">
        <h6
          class="h6"
          :class="{ progress__color: isJazz, progress__filled: genreId === 1 }"
        >
          Jazz
        </h6>
      </li>
      <li class="progress__item">
        <progress-arrow :color="isJazz" />
      </li>
      <li class="progress__item">
        <h6
          class="h6"
          :class="{ progress__color: isRock, progress__filled: genreId === 2 }"
        >
          Rock
        </h6>
      </li>
      <li class="progress__item">
        <progress-arrow :color="isRock" />
      </li>
      <li class="progress__item">
        <h6
          class="h6"
          :class="{ progress__color: isPop, progress__filled: genreId === 3 }"
        >
          Pop
        </h6>
      </li>
      <li class="progress__item">
        <progress-arrow :color="isPop" />
      </li>
      <li class="progress__item">
        <h6
          class="h6"
          :class="{
            progress__color: isSoundtrack,
            progress__filled: genreId === 4,
          }"
        >
          Soundtrack
        </h6>
      </li>
    </ul>
  </div>
</template>

<script>
import ProgressArrow from './ProgressArrow/ProgressArrow.vue'
export default {
  name: 'ProgressBar',
  components: { ProgressArrow },
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
    win: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isJazz: false,
      isRock: false,
      isPop: false,
      isSoundtrack: false,
    }
  },

  computed: {
    genreId() {
      return this.$store.state.genre.id
    },
  },
  watch: {
    win(newValue) {
      if (newValue) {
        if (this.genreId === 1) this.isJazz = true
        if (this.genreId === 2) this.isRock = true
        if (this.genreId === 3) this.isPop = true
        if (this.genreId === 4) this.isSoundtrack = true
      }
    },
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
