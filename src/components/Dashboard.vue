<template>

  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{ label }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-switch
              disabled
              :label="`Connected: ${connected}`"
              v-model="connected"
            ></v-switch>
            <v-switch
              true-value="on"
              false-value="off"
              :label="`Power: ${power}`"
              v-model="power"
            ></v-switch>
            <v-slider :min="minKelvin" :max="maxKelvin" label="Kelvin" v-model="kelvin"></v-slider>
            <v-slider :min="0" :max="1" label="Brightness" v-model="brightness"></v-slider>
            <v-slider :min="0" :max="100" label="Hue" v-model="hue"></v-slider>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-on:click="updateBulbState" color="primary">Update Bulb</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'Dashboard',
  created() {
    if (!this.$store.state.bulbStatusLoaded) {
      this.$store.dispatch('getBulbStatus')
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
      'bulbStatus.hue'
    ])
  },
  methods: {
    updateBulbState() {
      console.log('UPDATE')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
</style>
