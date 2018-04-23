import Vue from 'vue'
import Vuex from 'vuex'
//import axios from 'axios'
//import Lifx from 'lifx-http-api'
//import DarkSky from 'dark-sky'
import { getField, updateField } from 'vuex-map-fields'

Vue.use(Vuex)

//const lifxClient = new Lifx({ bearerToken: 'c04e8e6ad71bea9759ad73644699906603aae54fc06cb9ed8345625d1352f194' });
//const DarkSkyClient = new DarkSky('eb5b0d759acd17f7021f5d0c0108086a')

//let bulbId = 'd073d532af43'
//bulbId = 'all'

const createStore = () => {
  return new Vuex.Store({
    strict: true,
    state: {
      bulbStatus: {
        id: '',
        label: '',
        connected: '',
        power: '',
        brightness: 0,
        hue: 0,
        saturation: 0,
        kelvin: 0,
        minKelvin: 0,
        maxKelvin: 0
      },
      bulbStatusLoaded: false,
      currentWeather: {
        temperature: 0,
        weatherIcon: ''
      },
      applyWeather: false,
      dialog: {
        active: false,
        message: ''
      }
    },
    actions: {
      async getBulbStatus({ commit }) {
        /*try {
          const clientRes = await lifxClient.listLights(bulbId);
          commit('setBulbStatus', { bulbStatus: clientRes })
          commit('setBulbStatusLoaded', { bulbStatusLoaded: true })
        } catch(err) {
          console.error(err)
        }*/

        try {
          //this.$axios.setHeader('bucedup', 'shclient198827')
          const bulbRes = await this.$axios.get('/api/bulb-status')
          commit('setBulbStatus', { bulbStatus: bulbRes.data })
          commit('setBulbStatusLoaded', { bulbStatusLoaded: true })
        } catch(err) {
          console.error(err)
        }

      },
      async updateBulbState({ state, commit }, payload) {
        try {
          //let temp = Math.round(data.data.currently.temperature);
          // make sure the temp isn't above 100 because that's as high as we can go
          //let temp = 78
          //temp = temp < 100 ? temp : 100;
          //let hue = 200 + (160 * (temp / 100));

          const data = state.bulbStatus
          const bulbRes = await this.$axios.post('/api/update-bulb', data)
          const status = bulbRes.data.results[0].status

          if (status === 'ok') {
            commit('toggleDialog', { active: true, message: 'What a time. To be alive. Bulb Changed!' })
          } else {
            commit('toggleDialog', { active: true, message: 'hmmmm.. something didn\'t work - '+status })
          }

        } catch(err) {
          console.error(err)
          commit('toggleDialog', { active: true, message: 'Something went wrong - '+err })
        }
      },
      async getCurrentWeather({ commit }) {
        try {
          const latitude = 37.8267, longitude = -122.4233;
          const weatherRes = await this.$axios.get('/api/current-weather')
          commit('setWeather', { weather: weatherRes.data })
        } catch(err) {
          console.error(err)
        }
      }
    },
    getters: {
      getField
    },
    mutations: {
      updateField,
      setBulbStatus: (state, { bulbStatus }) => {
        //console.log(bulbStatus)
        state.bulbStatus.id = bulbStatus[0].id
        state.bulbStatus.label = bulbStatus[0].label
        state.bulbStatus.connected = bulbStatus[0].connected
        state.bulbStatus.power = bulbStatus[0].power
        state.bulbStatus.brightness = Number(bulbStatus[0].brightness).toFixed(2)
        state.bulbStatus.hue = Number(bulbStatus[0].color.hue).toFixed(2)
        state.bulbStatus.saturation = Number(bulbStatus[0].color.saturation).toFixed(2)
        state.bulbStatus.kelvin = bulbStatus[0].color.kelvin
        state.bulbStatus.minKelvin = bulbStatus[0].product.capabilities.min_kelvin
        state.bulbStatus.maxKelvin = bulbStatus[0].product.capabilities.max_kelvin
      },
      setBulbStatusLoaded: (state, { bulbStatusLoaded }) => {
        state.bulbStatusLoaded = bulbStatusLoaded
      },
      setWeather: (state, { weather }) => {
        //console.log(weather.currently)
        state.currentWeather.temperature = weather.currently.apparentTemperature
        state.currentWeather.weatherIcon = weather.currently.icon
      },
      toggleDialog: (state, { active, message }) => {
        state.dialog.active = active
        if (message) {
          state.dialog.message = message
        }
      }
    }
  })
}

export default createStore
