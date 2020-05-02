<template>
  <div id="vue-app">
    <h1>Clickable image</h1>
    <div class="container" v-on:click="addFlag">
      <img
        v-for="flag in flags"
        v-bind:key="flag"
        class="flag"
        :style="{top: flag.imgTop, left: flag.imgLeft}"/>
    </div>
  </div>
</template>


<script>
import database from "../utils/database";

export default {
  methods: {
    addFlag() {
      var imgLeft = `${event.clientX - 25}px`;
      var imgTop = `${event.clientY - 15}px`;
      var res = database.setFlag(imgLeft, imgTop);
      if (res.message == "success") {
        var id = res.data;
        this.flags[id] = { imgLeft: imgLeft, imgTop: imgTop };
        console.log(this.flags[1]);
      }
    },


  },

  data() {
    return {
      flags: {}
    };
  },

  created() {
      var res = database.getAllFlags();
      if (res.message == "success") {
        for (const index in res.data) {
          var flag = res.data[index];
          this.flags[flag.id] = { imgLeft: flag.xcoord, imgTop: flag.ycoord};
        }
      }
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
  margin: 0 auto;
  background: url(../images/flag.png) center no-repeat;
  background-size: 80%;
  position: fixed;
}
</style>