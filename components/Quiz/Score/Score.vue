<template>
  <div class="score">
    <app-logo />
    <div class="score__container">
      <img
        class="score__background-img"
        src="/img/circle/circle-sm.svg"
        alt="circle background image"
      />
      <div class="score__numbers">{{ score }}</div>
      <h3 class="score__title h3">
        {{
          `${user}${
            score === 12 ? ', did so great!' : ', you can do better, try again!'
          }`
        }}
      </h3>
      <p class="score__text p">
        {{
          `${
            score === 12
              ? `You got ${score} out of 12 points. You are definitely a music lover!`
              : `You've got ${score} out of 12 points`
          } `
        }}
      </p>
      <ui-button
        :disabled="!win"
        class="score__btn"
        type="button"
        text="try again"
        @click.native="onClick"
      />
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/Ui/Button/UiButton.vue'
import AppLogo from '@/components/Logotype/AppLogo.vue'
export default {
  name: 'AppScore',
  components: { UiButton, AppLogo },
  props: {
    win: {
      type: Boolean,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    onClick() {
      this.$emit('onclick')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Score.scss';
</style>
