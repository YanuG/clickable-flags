<template>
  <v-app id="data-app">
    <h1>Clickable flags</h1>
    <div class="container" v-on:click="leftClickHandle" />
    <img
      v-for="(flag, index) in flags"
      :key="flag.id"
      class="flag"
      v-on:contextmenu="displayRightClkMenu(flag, index)"
      :style="{top:flag.imgTop, left:flag.imgLeft}"
    />
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list>
        <v-list-item
          v-for="menuItem in menuItems"
          :key="menuItem"
          @click="rightClickAction(menuItem)"
        >
          <v-list-item-title>{{menuItem}}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app>
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

    leftClickHandle() {
      if (this.showMenu) this.showMenu = false;
      else this.addFlag();
    },

    displayRightClkMenu(flag, id) {
      event.preventDefault();
      this.showMenu = false;
      this.x = event.clientX;
      this.y = event.clientY;
      this.selected_flag = {};
      this.$nextTick(() => {
        this.showMenu = true;
        this.selected_flag.flag = flag;
        this.selected_flag.flags_array_id = id;
      });
    },
    /* eslint-disable no-unused-vars */
    rightClickAction(menuItem) {
      if (menuItem == this.menuItems[0]) {
        // delete
        var flag_id = this.selected_flag.flag.id;
        axios
          .delete(`http://localhost:8000/api/flags/${flag_id}`, {
            data: { id: flag_id }
          })
          .then(response => {
            this.$delete(this.flags, this.selected_flag.flags_array_id);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
    /* eslint-enable no-unused-vars */
  },
  data() {
    return {
      flags: [],
      showMenu: false,
      x: 0,
      y: 0,
      menuItems: ["delete"],
      selected_flag: {}
    };
  },

  created() {
    axios
      .get("http://localhost:8000/api/flags")
      .then(response => {
        const keys = Object.keys(response.data.data);
        var flagsArray = [];
        for (const key of keys) {
          var flagJson = {
            id: response.data.data[key].id,
            imgLeft: response.data.data[key].xcoord,
            imgTop: response.data.data[key].ycoord
          };
          flagsArray.push(flagJson);
        }
        this.flags = flagsArray;
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