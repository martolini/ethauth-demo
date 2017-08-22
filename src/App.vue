<template>
  <div id="app">
    <h1>Authenticate through ethereum</h1>
    <button v-on:click="loginJwt()">Auth with jwt</button>
    <button v-on:click="loginFirebase()">Auth with firebase</button>
    <p v-if="sentence">Challenge sentence: {{ sentence }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <pre v-if="user">{{ user }}</pre>
    <br />
    <a href="https://github.com/martolini/ethauth-demo" target='_blank'>Github</a>
  </div>
</template>

<script>

import {
  generateChallenge,
  authenticate
} from './utils';
import firebase from 'firebase';
var config = {
  apiKey: "AIzaSyC-u4Me4eWNIESgyJuaslhCN_ASoGddYHE",
  authDomain: "ethauth-msr.firebaseapp.com",
  databaseURL: "https://ethauth-msr.firebaseio.com",
  projectId: "ethauth-msr",
  storageBucket: "ethauth-msr.appspot.com",
  messagingSenderId: "967873784164"
};
firebase.initializeApp(config);

export default {
  name: 'app',
  data() {
    return {
      user: null,
      sentence: null,
      errorMessage: null
    }
  },
  methods: {
    loginJwt: function() {
      this.user = null;
      this.errorMessage = null;
      generateChallenge().then(({sentence, uuid}) => {
        this.sentence = sentence;
        return authenticate({
          sentence,
          uuid,
          provider: 'jwt'
        })
      }).then(user => {
        this.sentence = null;
        this.user = user;
      }).catch(err => {
        this.errorMessage = err.message.split('\n')[0]
        this.sentence = null;
      })
    },
    loginFirebase: function() {
      this.user = null;
      this.errorMessage = null;
      generateChallenge().then(({sentence, uuid}) => {
        this.sentence = sentence;
        return authenticate({
          sentence,
          uuid,
          provider: 'firebase'
        })
      }).then(user => {
        this.sentence = null;
        return firebase.auth().signInWithCustomToken(user.token).then(user => {
          this.user = user;
        }).catch(console.error)
      }).catch(err => {
        this.errorMessage = err.message.split('\n')[0]
        this.sentence = null;
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

button {
  padding: 10px 10px 10px 10px;
  font-size: 1rem;
}

</style>
