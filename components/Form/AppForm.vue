<template>
  <form class="form" autocomplete="off" @submit.prevent>
    <div class="form__container">
      <h3 class="form__title h3">Welcome!</h3>
      <p class="form__subtitle p">
        Please enter your name and lets start our quiz!
      </p>
      <div class="form__input-container">
        <input
          v-model.trim="name"
          class="form__input-field"
          type="text"
          autocomplete="none"
          :placeholder="placeholder"
        />
      </div>
      <ui-button
        :disabled="!name"
        class="form__btn"
        type="submit"
        text="start quiz"
        @click.native="onSubmit"
      />
    </div>
  </form>
</template>

<script>
import UiButton from '@/components/Ui/Button/UiButton.vue'
export default {
  name: 'AppForm',
  components: { UiButton },
  data() {
    return {
      name: '',
      placeholder: 'type your name here...',
    }
  },
  computed: {
    genreId() {
      return this.$store.state.loadedData[0].id
    },
  },
  methods: {
    onSubmit() {
      this.$store.commit('SET_USER', this.name)
      this.$store.commit('SET_GENRE', this.genreId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AppForm.scss';
</style>
