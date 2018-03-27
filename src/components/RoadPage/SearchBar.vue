<template>
  <div id="Searchbar">
    <input
      type="search"
      name="searchPOI"
      id="searchTile"
      placeholder="搜索景点.."
      v-model="keyWord">
    <transition name="list">
      <div id="searchResult" v-if="keyWord != ''">
        <ul>
          <template v-for="item in suggests">
            <div class="suggest" :key="item.id" @click="searchChecked(item)">
              <span type="name">{{item.name}}</span>
              <span type="location">{{item.address}}</span>
            </div>
          </template>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Searchbar",
  data() {
    return {
      keyWord: "",
      suggests: [],
      page: 1,
      lastSearch: null
    };
  },
  watch: {
    keyWord: function() {
      if (
        !this.lastSearch ||
        this.lastSearch.getTime() - new Date().getTime() <= -300
      ) {
        this.lastSearch = new Date();
        const pls = this.$store.state.AMap_PlaceSearch.search;

        let that = this;
        pls.search(this.keyWord, function(status, result) {
          if (status == "complete" && result.poiList.count > 0) {
            that.suggests = result.poiList.pois;
          } else {
            console.log(result);
          }
        });
      }
    }
  },
  methods: {
    searchChecked: function(poi) {
      let event = {
        id: poi.id,
        name: poi.name,
        lnglat: poi.location,
        type: poi.type
      };
      this.$emit("searchChecked", event);
      this.keyWord = "";
    }
  }
};
</script>

<style scoped>
#Searchbar {
  width: 25rem;
  text-align: center;
}
#searchTile {
  width: 90%;
  height: 35px;
  font-size: 1.25rem;
  color: grey;
  border: none;
  border-radius: 2px;
  padding-left: 1rem;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
  transition: all 0.2s ease;
}
#searchTile:focus {
  width: 95%;
  border-top: 3px solid #4d8eb1;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
}
#searchResult {
  width: 90%;
  margin: 0 auto;
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
}
#searchResult > ul {
  list-style: none;
  text-align: left;
  padding-left: 0;
  margin: 0;
}
.suggest {
  padding: 6px;
  padding-left: 1rem;
  transition: all 0.2s ease;
}
.suggest:hover {
  background-color: whitesmoke;
}
.suggest > span[type="name"] {
  color: #333;
}
.suggest > span[type="location"] {
  color: rgb(202, 202, 202);
}

.list-enter,
.list-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}
</style>
