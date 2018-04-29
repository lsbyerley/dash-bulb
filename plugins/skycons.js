import Vue from 'vue'
import Skycons from './skycons/skycons.js';
import SkyconComponent from './skycons/Skycon';

SkyconComponent.install = (Vue, options = {}) => {

  var skycons = new Skycons(options || {});
  skycons.play();

  Vue.prototype.$skycons = skycons;
  Vue.component('skycon', SkyconComponent)
}

Vue.use(SkyconComponent)
