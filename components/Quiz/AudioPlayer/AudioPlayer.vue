
<template>
  <div id="audio-player-root">
    <!-- Hide the default audio player -->
    <div>
      <audio
        ref="player"
        style="display: none"
        preload="none"
        :src="url"
        type="audio/mpeg"
      ></audio>
    </div>

    <div
      class="w-3/4 bg-gray-200 border border-gray-300 px-2 pt-2 mt-4 shadow-md"
      style="margin: auto"
    >
      <div id="player-row" class="inline-flex flex-wrap w-full max-w-5xl">
        <div id="button-div" class="flex-initial pr-3">
          <svg
            @click="toggleAudio()"
            v-show="!isPlaying"
            class="play-button text-gray-400"
            :class="{
              'text-orange-600': audioLoaded,
              'hover:text-orange-400': audioLoaded,
              'cursor-pointer': audioLoaded,
            }"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            @click="toggleAudio()"
            v-show="isPlaying"
            class="play-button text-orange-400 hover:text-orange-400 cursor-pointer"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <div
          id="progress-bar"
          class="flex-grow bg-white border border-blue-200"
        >
          <div class="overlay-container relative w-full h-full">
            <div class="range-container">
              <div ref="progress" class="progress"></div>
              <div ref="pin" class="pin"></div>
              <input
                v-model="playbackTime"
                type="range"
                min="0"
                :max="audioDuration"
                class="slider w-full h-full"
                id="position"
                name="position"
              />
            </div>

            <!-- Show loading indicator until audio has been loaded -->

            <div
              v-show="!audioLoaded"
              class="w-full absolute top-0 bottom-0 right-0 left-0 px-2 pointer-events-none"
              style="color: #94bcec"
            >
              Loading please wait...
            </div>

            <div
              v-show="audioLoaded"
              class="flex w-full justify-between absolute top-0 bottom-0 right-0 left-0 px-2 pointer-events-none"
            >
              <span
                class="text-sm"
                style="color: #94bcec"
                v-html="elapsedTime()"
              >
                00:00
              </span>

              <span class="text-sm" style="color: #94bcec" v-html="totalTime()">
                00:00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- outer gray border -->
  </div>
  <!-- white bg -->
  <!-- root -->
</template>

<script>
//  import { mapState } from 'vuex'
export default {
  name: 'AppAudio',
  props: ['url'],
  /**
   * playbackTime = local const  that syncs to audio.currentTime
   * audioDuration = duration of audio file in seconds
   * isPlaying = boolean (true if audio is playing)
   *
   **/
  data() {
    return {
      playbackTime: 0,
      audioDuration: 100,
      audioLoaded: false,
      isPlaying: false,
    }
  },
  methods: {
    // Set the range slider max value equal to audio duration
    initSlider() {
      const audio = this.$refs.player
      if (audio) {
        this.audioDuration = Math.round(audio.duration)
      }
    },
    // Convert audio current time from seconds to min:sec display
    convertTime(seconds) {
      const format = (val) => `0${Math.floor(val)}`.slice(-2)
      //   const hours = seconds / 3600
      const minutes = (seconds % 3600) / 60
      return [minutes, seconds % 60].map(format).join(':')
    },
    // Show the total duration of audio file
    totalTime() {
      const audio = this.$refs.player
      if (audio) {
        const seconds = audio.duration
        return this.convertTime(seconds)
      } else {
        return '00:00'
      }
    },
    // Display the audio time elapsed so far
    elapsedTime() {
      const audio = this.$refs.player
      if (audio) {
        const seconds = audio.currentTime
        return this.convertTime(seconds)
      } else {
        return '00:00'
      }
    },
    // Playback listener function runs every 100ms while audio is playing
    playbackListener(e) {
      const audio = this.$refs.player
      // Sync local 'playbackTime' const  to audio.currentTime and update global state
      this.playbackTime = audio.currentTime

      // console.log("update: " + audio.currentTime);
      // Add listeners for audio pause and audio end events
      audio.addEventListener('ended', this.endListener)
      audio.addEventListener('pause', this.pauseListener)
    },
    // Function to run when audio is paused by user
    pauseListener() {
      this.isPlaying = false
      this.listenerActive = false
      this.cleanupListeners()
    },
    // Function to run when audio play reaches the end of file
    endListener() {
      this.isPlaying = false
      this.listenerActive = false
      this.cleanupListeners()
    },
    // Remove listeners after audio play stops
    cleanupListeners() {
      const audio = this.$refs.player
      audio.removeEventListener('timeupdate', this.playbackListener)
      audio.removeEventListener('ended', this.endListener)
      audio.removeEventListener('pause', this.pauseListener)
      // console.log("All cleaned up!");
    },
    toggleAudio() {
      const audio = this.$refs.player
      // const  audio = document.getElementById("audio-player");
      if (audio.paused) {
        audio.play()
        this.isPlaying = true
      } else {
        audio.pause()
        this.isPlaying = false
      }
    },
    updateProgress() {
      const player = this.$refs.player
      const progress = this.$refs.progress
      const pin = this.$refs.pin
      const current = player.currentTime
      const percent = (current / player.duration) * 300
      progress.style.width = percent + 'px'
      pin.style.left = percent + 'px'

      // current.textContent = this.formatTime(current)
    },
    formatTime(time) {
      const min = Math.floor(time / 60)
      const sec = Math.floor(time % 60)
      return min + ':' + (sec < 10 ? '0' + sec : sec)
    },
  },
  mounted() {
    //  nextTick code will run only after the entire view has been rendered
    this.$nextTick(function () {
      const audio = this.$refs.player
      // Wait for audio to load, then run initSlider() to get audio duration and set the max value of our slider
      //  "loademetadata" Event https:// www.w3schools.com/tags/av_event_loadedmetadata.asp
      audio.addEventListener('timeupdate', this.updateProgress)
      audio.addEventListener(
        'loadedmetadata',
        function (e) {
          this.initSlider()
        }.bind(this)
      )
      //  "canplay" HTML Event lets us know audio is ready for play https:// www.w3schools.com/tags/av_event_canplay.asp
      audio.addEventListener(
        'canplay',
        function (e) {
          this.audioLoaded = true
        }.bind(this)
      )
      // Wait for audio to begin play, then start playback listener function
      this.$watch('isPlaying', function () {
        if (this.isPlaying) {
          const audio = this.$refs.player
          this.initSlider()
          // console.log("Audio playback started.");
          // prevent starting multiple listeners at the same time
          if (!this.listenerActive) {
            this.listenerActive = true
            // for a more consistent timeupdate, include freqtimeupdate.js and replace both instances of 'timeupdate' with 'freqtimeupdate'
            audio.addEventListener('timeupdate', this.playbackListener)
          }
        }
      })
      // Update current audio position when user drags progress slider
      this.$watch('playbackTime', function () {
        // const audio = this.$refs.player
        const diff = Math.abs(this.playbackTime - this.$refs.player.currentTime)

        // Throttle synchronization to prevent infinite loop between playback listener and this watcher
        if (diff > 0.01) {
          this.$refs.player.currentTime = this.playbackTime
        }
      })
    })
  },
}
</script>

<style lang="scss" scoped>
/* Play/Pause Button */
.play-button {
  height: 45px;
}

.range-container {
  overflow: hidden;
  position: relative;
  max-width: 326px;
}

.pin {
  height: 13px;
  width: 13px;
  border-radius: 50%;
  background: transparent;
  position: absolute;
  top: 10px;
  left: 0px;
  z-index: 4;
  cursor: pointer;
  //   &:hover {
  //     width: 17px;
  //     height: 17px;
  //     border: 1px solid #494d77;
  //     margin-top: -7px;
  //   }
}

.progress {
  position: absolute;
  top: 13px;
  left: 0;
  width: 1px;
  background: linear-gradient(270deg, #7e55b3 0%, #a769c4 100.02%);
  height: 3px;
  z-index: 3;
}

input[type='range']::-ms-track {
  width: 300px;
  height: 5px;
  overflow: hidden;
  /*remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead */
  background: transparent;

  /*leave room for the larger thumb to overflow with a transparent border */
  border-color: transparent;
  border-width: 6px 0;

  /*remove default tick marks*/
  color: transparent;
}
input[type='range']::-ms-fill-lower {
  background: #777;
  border-radius: 10px;
}
input[type='range']::-ms-fill-upper {
  background: #ddd;
  border-radius: 10px;
}
input[type='range']::-ms-thumb {
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: goldenrod;
}
input[type='range']:focus::-ms-fill-lower {
  background: #888;
}
input[type='range']:focus::-ms-fill-upper {
  background: #ccc;
}

input[type='range'] {
  -webkit-appearance: none;
}

input[type='range']::-webkit-slider-runnable-track {
  min-width: 326px;
  height: 5px;
  position: relative;
  background: #494d77;
  border: none;
  border-radius: 3px;
  z-index: 2;
  //   overflow: hidden;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 13px;
  width: 13px;
  margin-top: -4px;
  border-radius: 50%;
  background: #fff;
  z-index: 999;
  cursor: pointer;
  //   background-image: linear-gradient(270deg, #7e55b3 0%, #a769c4 100.02%);
  //   box-shadow: -100vw 0 0 100vw #7e55b3;
}

input[type='range']:focus {
  outline: none;
}

input[type='range']::-webkit-slider-runnable-track {
  background: #494d77;
}
</style>

