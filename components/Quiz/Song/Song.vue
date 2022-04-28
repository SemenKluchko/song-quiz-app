<template>
  <div
    class="song"
    :class="{ [win ? 'song__success' : 'song__fail']: isClicked }"
    @click="onClick"
  >
    <div class="song__item">
      <div class="song__circle">
        <img
          v-if="win && isClicked"
          src="/img/song/check.svg"
          alt="check image"
        />
        <img v-if="!win && isClicked" src="/img/song/x.svg" alt="check image" />
      </div>
      <p class="song__title p">{{ `0${songId}:  ${name} - ${title}` }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSong',
  props: {
    title: {
      type: String,
      default: '',
      required: true,
    },
    name: {
      type: String,
      default: '',
      required: true,
    },
    songId: {
      type: [String, Number],
      default: 1,
      required: true,
    },
    win: {
      type: Boolean,
      required: true,
    },
    winner: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isClicked: false,
    }
  },
  computed: {
    className() {
      return this.win ? 'success' : 'fail'
    },
  },
  methods: {
    onClick() {
      if (this.winner) return
      this.isClicked = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Song.scss';
</style>
