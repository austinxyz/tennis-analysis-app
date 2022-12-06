<script>
import axios from "axios";
import Players from "./Players.vue";

export default {

  data() {
    return {
        teamName: '',
        players: [],
    };
  },

  mounted() {
    let teamId = this.$route.query.team;
    let eventId = this.$route.query.event;

    if (eventId == null) {
        eventId = "123233";
    }

    if (teamId == null) {
        teamId = "200250";
    }

    axios.get("http://localhost:8080/event/" + eventId + "/team/" + teamId)
        .then(response => {
            this.teamName = response.data.displayName;
            this.players = response.data.players;
        })
  },

  components: {
    Players
  }
}
</script>

<template>
       <div class="m-2 flex flow-row">
            <div class="w-50 min-w-fit">
                <Players :teamName="teamName" :players="players" />
            </div>
      </div>
</template>

