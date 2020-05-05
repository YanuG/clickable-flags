<template>
  <div id="vue-app">
    <h1>Clickable image</h1>
    <div class="container" v-on:click="addFlag">
      <img
        v-for="flag in flags"
        :key="flag.id"
        v-on:contextmenu="displayRightClkMenu" 
        class="flag"
        :style="{top:flag.imgTop, left:flag.imgLeft}"
      />
    </div>

    <!-- <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
        <div v-for="menuItem in menuItems" :key="menuItem" @click="clickAction">
          <a>{{menuItem}}</a>
        </div>
    </v-menu>-->
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
        })
        .catch(error => {
          console.log(error);
        });
    },

    displayRightClkMenu(e) {
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },

    clickAction() {
      console.log("I've been clicked");
    }
  },
  data() {
    return {
      flags: [],
      showMenu: false,
      x: 0,
      y: 0,
      menuItems: ["delete"]
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
            imgTop: response.data.data[key].ycoord
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