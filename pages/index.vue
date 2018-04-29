<template>

  <v-layout justify-space-between>

    <v-flex xs12 sm4 offset-sm1>
      <v-card class="elevation-12 bulbSettings">
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{ label }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
            <v-layout row>
              <v-flex xs6>
                <v-switch disabled :label="`Connected: ${connected}`" v-model="connected"></v-switch>
              </v-flex>
              <v-flex xs6>
                <v-switch true-value="on" false-value="off" :label="`Power: ${power}`" v-model="power"></v-switch>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs10>
                <v-slider :min="0" :max="360" :step=".01" label="Hue" v-model="hue" :disabled="power==='off'"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-card-media :style="bulbColorStyle"></v-card-media>
              </v-flex>
              <v-flex xs10>
                <v-slider :min="0" :max="1" :step=".01" label="Saturation" v-model="saturation" :disabled="power==='off'"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field class="bulbInput" v-model="saturation" type="number"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider :min="0" :max="1" :step=".01" label="Brightness" v-model="brightness" :disabled="power==='off'"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field class="bulbInput" v-model="brightness" type="number"></v-text-field>
              </v-flex>
            </v-layout>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn v-on:click="updateBulbState" color="primary">Update Bulb</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 sm4>
      <v-card class="elevation-12 currentWeather">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Current Weather</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-layout row>
            <v-flex xs6>
              <v-switch label="Apply Weather Hue" v-model="applyWeather" v-on:change="setToWeather()"></v-switch>
            </v-flex>
            <v-flex xs6 class="currentTemp">
              <p class="display-2">{{ formattedTemp }}</p>
              <v-icon>fas fa-thermometer-half</v-icon>
              <!--<skycon :condition="weatherIcon"></skycon>-->
              <p>{{ summary }}</p>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-dialog v-model="active" max-width="500px">
      <v-card>
        <v-card-title>
          <span>{{ message }}</span>
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { hsvToRgb, hsv_to_rgb } from '@/utils/util'

export default {
  name: 'Dashboard',
  async fetch ({ store, params }) {
    if (!store.state.bulbStatusLoaded) {
      await store.dispatch('getBulbStatus', { firsttime: true })
      await store.dispatch('getCurrentWeather')
    }
  },
  head() {
    return {
      title: 'Dashbulb'
    }
  },
  computed: {
    ...mapFields([
      'bulbStatus.connected',
      'bulbStatus.label',
      'bulbStatus.power',
      'bulbStatus.kelvin',
      'bulbStatus.minKelvin',
      'bulbStatus.maxKelvin',
      'bulbStatus.brightness',
      'bulbStatus.hue',
      'bulbStatus.saturation',
      'dialog.active',
      'dialog.message',
      'currentWeather.temperature',
      'currentWeather.weatherIcon',
      'currentWeather.summary',
      'applyWeather'
    ]),
    bulbColorStyle() {
      const h = Number(this.hue).toFixed(0)
      const s = (this.saturation * 100).toFixed(0)
      const v = (this.brightness * 100).toFixed(0)
      const rgb = hsvToRgb( [h, s, v] )
      const bgColor = `rgb(${rgb[0].toFixed(0)}, ${rgb[1].toFixed(0)}, ${rgb[2].toFixed(0)})`

      const test = hsv_to_rgb(h, s, v)
      console.log(test)

      return {
        background: bgColor,
        height: '50px'
      }
    },
    formattedTemp() {
      return this.temperature.toFixed(0)
    }
  },
  methods: {
    setToWeather() {
      if (this.applyWeather) {
        let temp = Math.round(this.temperature);
        // make sure the temp isn't above 100 because that's as high as we can go
        temp = temp < 100 ? temp : 100;
        const hue = 200 + (160 * (temp / 100));
        console.log('weather-hue', hue)
        this.$store.commit('setBulbToWeather', { hue: hue })
      }
    },
    updateBulbState() {
      this.$store.dispatch('updateBulbState')
    },
    closeDialog() {
      this.$store.commit('toggleDialog', { active: false })
    }
  }
}
</script>

<style lang="styl" scoped>
.columns {
  display: flex;
  justify-content: center;
  vertical-align: center;
  align-items: center;
  height: 100vh;
  background: #F7F7F7;

  .card {
    .card-header {
      padding: 1rem;
      background: #00b89c;

      .card-header-title {
        font-size: 1.5rem;
        padding: 0;
      }
    }
  }
}

.card.currentWeather {
  margin-bottom: 1rem;

  .currentTemp {
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      margin: 0 3px 0 0;
    }
  }
}

.card.bulbSettings {

  .primary--text input {
    text-align: center;
  }

  .bulbInput {
    padding-top: 3px;

    .input-group__input input {
      text-align: center;
    }
  }

}
</style>
