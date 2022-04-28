<template>
  <main class="main content">
    <section v-if="!user" class="main__container">
      <app-form />
      <app-logo class="main__logo" />
    </section>
    <article v-else>
      <div v-if="!endGame" class="quiz">
        <header class="quiz__header">
          <app-logo class="quiz__logo" />
          <div class="quiz__info">
            <h5 class="quiz__user">{{ user }}</h5>
            <p class="quiz__score p1">Your Score: {{ score }}</p>
          </div>
        </header>
        <div class="quiz__container">
          <div class="quiz__progress progress">
            <div class="progress__line">
              <div ref="fill" class="progress__fill"></div>
              <div ref="answ" class="progress__answered"></div>
            </div>
            <ul class="progress__bar">
              <li class="progress__item">Jazz</li>
              <li class="progress__item">
                <img src="/img/btn/arrow.svg" alt="arrow image" />
              </li>
              <li class="progress__item">Rock</li>
              <li class="progress__item">
                <img src="/img/btn/arrow.svg" alt="arrow image" />
              </li>
              <li class="progress__item">Pop</li>
              <li class="progress__item">
                <img src="/img/btn/arrow.svg" alt="arrow image" />
              </li>
              <li class="progress__item">Soundtrack</li>
            </ul>
          </div>

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
      <div v-else class="score">
        <app-logo class="main__logo" />
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
                score === 12
                  ? ', did so great!'
                  : ', you can do better, try again!'
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
            @click.native="getNextGenre"
          />
        </div>
      </div>
    </article>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import TestPlayer from '@/components/Quiz/TestPlayer/TestPlayer.vue'
import UiButton from '@/components/Ui/Button/UiButton.vue'
import Song from '@/components/Quiz/Song/Song.vue'
import AppForm from '@/components/Form/AppForm.vue'
import AppLogo from '@/components/Logotype/AppLogo.vue'
export default {
  name: 'IndexPage',
  components: { AppForm, AppLogo, Song, UiButton, TestPlayer },
  data() {
    return {
      currentSong: null,
      endGame: false,
      genreId: 2,
      win: false,
      chances: 3,
      score: 0,
    }
  },
  computed: {
    ...mapState(['user']),
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
        this.$refs.answ.style.width = (this.genreId - 1 / 4) * 100 + '%'
      } else {
        this.chances--
      }
    },
    getNextGenre() {
      if (this.endGame) {
        this.endGame = false
        this.score = 0
      } else {
        this.$refs.fill.style.width = (this.genreId - 1 / 4) * 150 + '%'
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
.main {
  &__logo {
    position: fixed;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.quiz {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  &__info {
    display: flex;
    justify-content: space-between;
    gap: 30px;
  }
  &__container {
    min-width: 1680px;
    background-color: $form-background;
    border-radius: 0px 0px 10px 10px;
    position: relative;

    @include max(lg) {
      min-width: 1200px;
    }
  }

  &__body {
    padding: 60px 60px 90px 60px;
    display: flex;
    justify-content: flex-start;
    gap: 60px;

    @include max(lg) {
      gap: 30px;
      padding: 40px 20px;
    }
    @include max(bg) {
      flex-direction: column;
      justify-content: center;
      align-items: center;
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
  }
}

.preview {
  max-width: 1000px;
  // @include max(bg) {
  //   max-width: unset;
  // }

  &__container {
    border-radius: 10px 10px 0px 0px;
    border: 1px solid #373b62;
    width: 100%;
    height: 461px;
    margin: 30px 0;
  }
  &__description {
    text-align: center;
    min-height: 100px;
  }

  &__title {
    font-size: 20px;
    line-height: 30px;
  }
  &__image-box {
    position: relative;
    display: flex;
    max-height: 374px;
  }

  &__image {
    border-radius: 10px 10px 0px 0px;
    object-fit: cover;
    object-position: 50% 20%;
    // width: 1000px;
    // height: 374px;
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
    width: 540px;
    height: 376px;
  }
}

.score {
  &__container {
    min-width: 1100px;
    min-height: 353px;
    background-color: $form-background;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  &__numbers {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -93px);
    width: 141px;
    height: 141px;
    border-radius: 50%;
    background-color: #373b62;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Arial';
    font-style: normal;
    font-weight: 700;
    font-size: 48px;
    line-height: 150%;
  }
  &__text {
    margin-top: 10px;
  }

  &__background-img {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -182px);
    z-index: -1;
  }

  &__btn {
    margin-top: 30px;
  }
}

.test-player {
  width: 100%;
  background-color: #373b62;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 53px;

  border-radius: 5px;
  border: 1px solid #373b62;
}

.player-short {
  height: 154px;
  padding: 0 20px 0 50px;
}

.player-long {
  gap: 20px;
  height: 87px;
  padding: 0 20px 0 20px;
}

.progress {
  width: 100%;
  height: 42px;
  border-bottom: 1px solid #373b62;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 10px;

  &__bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 220px;
    font-family: 'Arial';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 150%;
    text-transform: uppercase;
  }

  &__line {
    width: 100%;
    height: 5px;
    background: rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
  }

  &__fill {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 5px;
    background: linear-gradient(
        270deg,
        rgba(255, 255, 255, 0) 74.64%,
        #ffffff 87.86%
      ),
      rgba(255, 255, 255, 0.2);
  }

  &__answered {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 0;
    height: 5px;
    background: linear-gradient(
      270.05deg,
      rgba(126, 85, 179, 0) 73.26%,
      #a769c4 85%,
      #a769c4 99.71%
    );
  }
}
</style>
