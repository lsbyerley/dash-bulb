import Vue from 'vue'
import Vuex from 'vuex'
import LIFX from 'lifx-http-api'

let lifxClient = new LIFX({
  bearerToken: 'my-token'
});

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    bulbStatus: {},
    bulbStatusLoaded: false
  },
  actions: {
    async getBulbStatus({ commit }) {
      try {
        //const res = await this.$axios.get('/api/bulb-status')
        const clientRes = await lifxClient.listLights('all');
        commit('setBulbStatus', { bulbStatus: clientRes.data })
        commit('setBulbStatusLoaded', { bulbStatusLoaded: true })
      } catch(err) {
        console.error(err)
      }
    },
    increment ({ commit }) {
      console.log('increment')
    }
  },
  mutations: {
    setBulbStatus: (state, { bulbStatus }) => {
      state.bulbStatus = bulbStatus[0]
    },
    setBulbStatusLoaded: (state, { bulbStatusLoaded }) => {
      state.bulbStatusLoaded = bulbStatusLoaded
    },
  },
  actions: {

  }
})
