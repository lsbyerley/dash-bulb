import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'

Vue.use(Vuex)

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
        weatherIcon: '',
        summary: ''
      },
      applyWeather: false,
      dialog: {
        active: false,
        message: ''
      }
    },
    actions: {
      async getBulbStatus({ commit }, payload) {

        console.log('PAYLOAD', payload.firsttime)

        try {
          const bulbRes = await this.$axios.get('/api/bulb-status')
          console.log(bulbRes.data[0].color.hue)
          commit('setBulbStatus', { bulbStatus: bulbRes.data })
          commit('setBulbStatusLoaded', { bulbStatusLoaded: true })
        } catch(err) {
          console.error(err)
        }

      },
      async updateBulbState({ state, commit, dispatch }, payload) {
        try {
          const data = state.bulbStatus
          console.log('UPDATING TO: ', data.hue)
          const bulbRes = await this.$axios.post('/api/update-bulb', data)
          const status = bulbRes.data.results[0].status

          if (status === 'ok') {
            commit('toggleDialog', { active: true, message: 'What a time. To be alive. Bulb Changed!' })
          } else {
            commit('toggleDialog', { active: true, message: 'hmmmm.. something didn\'t work - '+status })
          }

          //commit('setBulbStatusLoaded', { bulbStatusLoaded: false })
          const newStatus = await dispatch('getBulbStatus', { firsttime: false })
          console.log('NEW STATUS', newStatus)

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
        state.currentWeather.summary = weather.currently.summary
        state.currentWeather.temperature = weather.currently.apparentTemperature
        state.currentWeather.weatherIcon = weather.currently.icon
      },
      toggleDialog: (state, { active, message }) => {
        state.dialog.active = active
        if (message) {
          state.dialog.message = message
        }
      },
      setBulbToWeather: (state, { hue }) => {
        state.applyWeather = true
        state.bulbStatus.hue = hue
        state.bulbStatus.saturation = 100
        state.bulbStatus.brightness = 100
      }
    }
  })
}

export default createStore
