import Vue from 'vue'
import Vuex from 'vuex'
import LIFX from 'lifx-http-api'
import { getField, updateField } from 'vuex-map-fields';

let lifxClient = new LIFX({
  bearerToken: 'my-token'
});

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    bulbStatus: {
      id: '',
      label: '',
      connected: '',
      power: '',
      brightness: '',
      hue: '',
      saturation: '',
      kelvin: '',
      minKelvin: '',
      maxKelvin: ''
    },
    bulbStatusLoaded: false
  },
  actions: {
    async getBulbStatus({ commit }) {
      try {
        const clientRes = await lifxClient.listLights(bulbId);
        commit('setBulbStatus', { bulbStatus: clientRes })
        commit('setBulbStatusLoaded', { bulbStatusLoaded: true })
      } catch(err) {
        console.error(err)
      }
    },
    async updateBulbState({commit}, payload) {
      try {
        const clientRes = await lifxClient.setState('all', {
          power: payload.power,
          //color: 'blue saturation:0.5',
          color: payload.color,
          brightness: payload.brightness
        })
      } catch(err) {

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
      state.bulbStatus.brightness = bulbStatus[0].brightness
      state.bulbStatus.hue = bulbStatus[0].color.hue
      state.bulbStatus.saturation = bulbStatus[0].color.saturation
      state.bulbStatus.kelvin = bulbStatus[0].color.kelvin
      state.bulbStatus.minKelvin = bulbStatus[0].product.capabilities.min_kelvin
      state.bulbStatus.maxKelvin = bulbStatus[0].product.capabilities.max_kelvin
    },
    setBulbStatusLoaded: (state, { bulbStatusLoaded }) => {
      state.bulbStatusLoaded = bulbStatusLoaded
    }
  }
})
