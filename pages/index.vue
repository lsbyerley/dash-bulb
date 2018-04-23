<template>

  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Current Weather</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-layout row>
            <v-flex xs6>
              <v-switch label="Weather" v-model="applyWeather"></v-switch>
            </v-flex>
            <v-flex xs6>
              <p class="display-2">{{ formattedTemp }}</p>
              <v-icon>fas fa-thermometer-half</v-icon>
              <Skycon :condition="weatherIcon" />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
      <v-card class="elevation-12">
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
                <v-text-field class="bulb-setting" v-model="saturation" type="number"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider :min="0" :max="1" :step=".01" label="Brightness" v-model="brightness" :disabled="power==='off'"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field class="bulb-setting" v-model="brightness" type="number"></v-text-field>
              </v-flex>
            </v-layout>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn v-on:click="updateBulbState" color="primary">Update Bulb</v-btn>
        </v-card-actions>
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
import { hsvToRgb } from '@/utils/util'

export default {
  name: 'Dashboard',
  async fetch ({ store, params }) {
    if (!store.state.bulbStatusLoaded) {
      await store.dispatch('getBulbStatus')
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
      'applyWeather'
    ]),
    bulbColorStyle() {
      const h = Number(this.hue).toFixed(0)
      const s = (this.saturation * 100).toFixed(0)
      const v = (this.brightness * 100).toFixed(0)
      const rgb = hsvToRgb( [h, s, v] )
      const bgColor = `rgb(${rgb[0].toFixed(0)}, ${rgb[1].toFixed(0)}, ${rgb[2].toFixed(0)})`
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

.bulb-setting {
  padding-top: 3px;
  text-align: center;

  .input-group__input input {
    text-align: center;
  }
}
</style>
