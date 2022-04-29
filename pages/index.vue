<template>
  <main class="main content">
    <section v-if="!user" class="main__container">
      <app-form />
      <app-logo />
    </section>
    <article v-else>
      <div v-if="!endGame" class="quiz">
        <header class="quiz__header">
          <app-logo :is-quiz="true" />
          <div class="quiz__info">
            <h5 class="quiz__user">{{ user }}</h5>
            <p class="quiz__score p1">Your Score: {{ score }}</p>
          </div>
        </header>
        <div class="quiz__container">
          <progress-bar :filled="filled" :answered="answered" />
          <div class="quiz__body">
            <section class="quiz__questions questions">
              <div class="questions__description">
                <h3 class="questions__title h3">{{ getGenre }} song</h3>
                <p class="questions__text p">
                  Listen to the audio and guess what song is it from the list
                </p>
              </div>
              <div class="questions__audio">
                <img
                  class="questions__background"
                  :src="
                    win
                      ? 'https://levi9-song-quiz.herokuapp.com/api/' +
                        getRandomSong.image
                      : '/img/player/background.png'
                  "
                  alt="song background image"
                />
                <test-player
                  :audio-list="
                    'https://levi9-song-quiz.herokuapp.com/api/' +
                    getRandomSong.audio
                  "
                  class="test-player player-short"
                />
              </div>
              <div class="questions__songs-wrapp">
                <song
                  v-for="(song, idx) in songsArr"
                  :key="song.id"
                  class="questions__song"
                  :name="song.name"
                  :title="song.songTitle"
                  :song-id="idx + 1"
                  :win="getRandomSong.id === song.id"
                  :winner="win"
                  @click.native="onClick(song, idx + 1)"
                />
              </div>
            </section>
            <section class="quiz__preview">
              <div v-if="currentSong" class="preview">
                <h3 class="preview__title h3">
                  {{
                    `0${currentSong.currentId}: ${currentSong.name}  -  ${currentSong.songTitle}`
                  }}
                </h3>
                <div class="preview__container">
                  <div class="preview__image-box">
                    <img
                      :src="
                        'https://levi9-song-quiz.herokuapp.com/api/' +
                        currentSong.image
                      "
                      class="preview__image"
                      alt="preview image"
                    />
                  </div>
                  <test-player
                    :audio-list="
                      'https://levi9-song-quiz.herokuapp.com/api/' +
                      currentSong.audio
                    "
                    class="test-player player-long"
                  />
                </div>
                <p class="preview__description p">
                  {{ currentSong.description }}
                </p>
              </div>
              <div v-else>
                <img
                  class="default-img"
                  src="/img/circle/circle.svg"
                  alt="circle image"
                />
              </div>
            </section>
          </div>
        </div>
        <ui-button
          :disabled="!win"
          class="quiz__btn"
          type="button"
          :text="buttonText"
          @click.native="getNextGenre"
        />
      </div>
      <score v-else :win="win" :score="score" @onclick="getNextGenre" />
    </article>
  </main>
</template>

<script>
import Score from '@/components/Quiz/Score/Score.vue'
import ProgressBar from '@/components/Quiz/ProgressBar/ProgressBar.vue'
import TestPlayer from '@/components/Quiz/TestPlayer/TestPlayer.vue'
import UiButton from '@/components/Ui/Button/UiButton.vue'
import Song from '@/components/Quiz/Song/Song.vue'
import AppForm from '@/components/Form/AppForm.vue'
import AppLogo from '@/components/Logotype/AppLogo.vue'
export default {
  name: 'IndexPage',
  components: {
    AppForm,
    AppLogo,
    Song,
    UiButton,
    TestPlayer,
    ProgressBar,
    Score,
  },
  data() {
    return {
      currentSong: null,
      endGame: false,
      genreId: 2,
      win: false,
      chances: 3,
      score: 0,
      filled: '',
      answered: '',
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    songsArr() {
      return this.$store.getters.songsArr
    },
    getRandomSong() {
      return this.$store.getters.songsArr[Math.floor(Math.random() * 4)]
    },
    getGenre() {
      return this.$store.getters.getGenre
    },
    buttonText() {
      return this.genreId === 5 ? 'See My Score' : 'Next question'
    },
  },
  methods: {
    onClick(song, index) {
      this.currentSong = { ...song, currentId: index }
      if (this.win) return
      if (song.id === this.getRandomSong.id) {
        this.win = true
        this.score += this.chances
        this.answered = (this.genreId - 1 / 4) * 90 + '%'
      } else {
        this.chances--
      }
    },
    getNextGenre() {
      if (this.endGame) {
        this.endGame = false
        this.score = 0
      } else {
        this.filled = (this.genreId - 1 / 4) * 150 + '%'
      }
      if (this.genreId === 5) {
        this.endGame = true
        this.genreId = 1
        return
      }
      this.$store.commit('SET_GENRE', this.genreId + '')
      this.genreId++
      this.win = false
      this.chances = 3
      this.currentSong = null
    },
  },
}
</script>
<style lang="scss" scoped>
.quiz {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;

  @include max(lg) {
    padding: 40px 30px;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

    @include max(lg) {
      margin-bottom: 10px;
    }
  }

  &__info {
    display: flex;
    justify-content: space-between;
    gap: 30px;

    @include max(xs) {
      gap: 10px;
      justify-content: center;
      flex-direction: column;
      align-items: flex-end;
    }
  }
  &__container {
    max-width: 1680px;
    background-color: $form-background;
    border-radius: 0px 0px 10px 10px;
    position: relative;

    @include max(lg) {
      max-width: 1200px;
    }
    @include max(bg) {
      max-width: 1000px;
    }
    @include max(sm) {
      max-width: 700px;
    }
    @include max(xs) {
      max-width: 475px;
    }
  }

  &__body {
    padding: 60px 60px 50px 60px;
    display: flex;
    justify-content: flex-start;
    gap: 60px;

    @include max(lg) {
      gap: 40px;
      padding: 40px 20px;
    }

    @include max(bg) {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 30px;
      padding: 30px 45px;
    }

    @include max(xs) {
      padding: 25px 20px;
    }
  }

  &__btn {
    margin-top: 10px;
    align-self: flex-end;
  }
}

.questions {
  @include max(bg) {
    width: 100%;
  }
  &__title {
    &::first-letter {
      text-transform: capitalize;
    }
  }
  &__text {
    margin-top: 10px;

    @include max(xs) {
      margin-top: 5px;
    }
  }
  &__audio {
    margin: 30px 0;
    position: relative;
  }
  &__songs-wrapp {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }

  &__background {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 114px;
    height: 114px;
    object-fit: cover;
    border-radius: 5px;
    @include max(375) {
      top: 30px;
      left: 10px;
      width: 100px;
      height: 100px;
    }
  }
}

.preview {
  max-width: 1000px;
  // @include max(bg) {
  //   max-width: unset;
  // }

  &__container {
    border-radius: 10px;
    border: 1px solid #373b62;
    width: 100%;
    margin: 30px 0;
  }
  &__description {
    text-align: center;
    min-height: 60px;

    @include max(xs) {
      min-height: 40px;
    }
  }

  &__title {
    font-size: 20px;
    line-height: 30px;

    @include max(xs) {
      font-size: 15px;
    }
  }
  &__image-box {
    position: relative;
    display: flex;
    max-height: 374px;

    @include max(lg) {
      max-height: 320px;
    }
  }

  &__image {
    border-radius: 10px 10px 0px 0px;
    object-fit: cover;
    object-position: 50% 20%;
  }
}

.default-img {
  position: absolute;
  right: 0;
  bottom: 0;
  @include max(lg) {
    width: 640px;
    height: 476px;
  }
  @include max(bg) {
    display: none;
  }
}

.test-player {
  width: 100%;
  background-color: #373b62;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 53px;
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #373b62;

  @include max(xs) {
    gap: 15px;
  }
}

.player-short {
  height: 154px;
  padding: 0 20px 0 50px;
  border-radius: 5px;

  @include max(xs) {
    gap: 52px;
  }
  @include max(375) {
    padding: 0 15px 0 36px;
    gap: 43px;
  }
}

.player-long {
  gap: 20px;
  height: 87px;
  padding: 0 20px 0 20px;
}
</style>
