<template>
  <div id="vue-app">
    <h1>Clickable image</h1>
    <div class="container" v-on:click="addFlag">
      <img
        v-for="flag in flags"
        :key="flag.id"
        class="flag"
        :style="{top:flag.imgTop, left:flag.imgLeft}"
      />
    </div>
  </div>
</template>


<script>
const axios = require("axios");

export default {
  methods: {
    addFlag() {
      var imgLeft = `${event.clientX - 25}px`;
      var imgTop = `${event.clientY - 15}px`;
      axios
        .post("http://localhost:8000/api/flags", {
          xcoord: imgLeft,
          ycoord: imgTop
        })
        .then(response => {
          var flagJson = {
            id: response.data.id,
            imgTop: imgTop,
            imgLeft: imgLeft
          };
          this.flags.push(flagJson);
          console.log(this.flags);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  data() {
    return {
      flags: []
    };
  },

  created() {
    axios
      .get("http://localhost:8000/api/flags")
      .then(response => {
        const keys = Object.keys(response.data.data);
        var flagsArray = [];
        for (const key of keys) {
          response.data.data[key].id = key;
          var flagJson = {
            id: response.data.data[key].id,
            imgLeft: response.data.data[key].xcoord,
            imgTop: response.data.data[key].ycoord,
          };
          flagsArray.push(flagJson);
        }
        this.flags = flagsArray;
        this.flags_length = this.flags.length - 1;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  border: solid;
  height: 80vh;
}

.flag {
  width: 50px;
  height: 50px;
  background: url(../images/flag.png) center no-repeat;
  background-size: 80%;
  position: fixed;
}
</style>