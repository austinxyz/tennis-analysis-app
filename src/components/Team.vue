<script>
import axios from "axios";
import Players from "./Players.vue";
import Line from "./Line.vue";

export default {

  data() {
    return {
        teamName: '',
        players: [],
        d1:[],
        d2:[],
        d3:[],
        md:[],
        wd:[],
    };
  },

  mounted() {
    let teamId = this.$route.query.team;

    if (teamId == null) {
        teamId = "ZJU-BYD";
    }

    axios.get("http://localhost:8080/team?team=" + teamId)
        .then(response => {
            this.teamName = response.data.displayName;
            this.players = response.data.players;
            this.d1 = response.data.d1.topPairs;
            this.d2 = response.data.d2.topPairs;
            this.d3 = response.data.d3.topPairs;
            this.md = response.data.md.topPairs;
            this.wd = response.data.wd.topPairs;
        })
  },

  components: {
    Players,
    Line
  }
}
</script>

<template>
       <div class="m-2 flex flow-row">
            <div class="w-50 min-w-fit">
                <Players :teamName="teamName" :players="players" />
            </div>
            <div>
                <div class="flex flex-row">
                    <div class="w-50 min-w-fit">
                        <Line lineName="D1" :pairs="d1" />
                    </div>
                    <div class="w-50 min-w-fit">
                        <Line lineName="D2" :pairs="d2" />
                    </div>
                    <div class="w-50 min-w-fit">
                        <Line lineName="D3" :pairs="d3" />
                    </div>
                </div>
                <div class="flex flex-row">
                    <div class="w-50 min-w-fit">
                        <Line lineName="MD" :pairs="md" />
                    </div>
                    <div class="w-50 min-w-fit">
                        <Line lineName="WD" :pairs="wd" />
                    </div>
                </div>
            </div>
      </div>
</template>

