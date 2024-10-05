<!-- src/components/NEOIntroduction.vue -->
<template>
  <div class="container">
    <div class="text-center">
      <!-- <h2>NEO Lookup</h2> -->
    </div>
    <div class="container d-flex flex-wrap justify-center event-container">
      <div class="event-selector" style="flex: 1;">
        <h3>Select an Event</h3>
        <v-card class="mx-auto" max-width="300">
          <v-list>
            <template v-if="eventList.length">
              <v-list-item-group v-model="selectedEvent">
                <v-list-item
                  v-for="item in eventList"
                  :key="item.id"
                  :value="item.id"
                >
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </template>
            <template v-else>
              <v-list-item disabled>
                <v-list-item-title>No Events</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </div>

      <div class="event-details d-flex flex-wrap" style="flex: 3; margin-left: 20px;">
        <div class="event-card" style="flex: 1; margin-right: 20px;">

        </div>
        <div class="event-card" style="flex: 2;">
          <div id="event-content"></div>
          <div id="event-table"></div>
          <div id="event-links"></div>
        </div>
      </div>
    </div>

    <div class="timeline">
      <v-timeline class="neo-timeline" direction="horizontal" line-thickness="5" line-color="rgba(255, 255, 255, 0.3)" size="small" hide-opposite="true">
        <!-- <div class="simple-line"></div> -->
        <v-timeline-item
          v-for="day in timelineDays"
          :key="day.date"
          :title="day.title"
        >
          <template v-slot:default>
            <div>{{ day.title }}</div>
          </template>
        </v-timeline-item>
      </v-timeline>
    </div>
    <div class="timeline-controls d-flex flex-column align-items-center mb-4">
      <div class="d-flex justify-center align-items-center mb-2">
        <button class="timeline-btn" @click="prevMonth">
          <span class="mdi mdi-menu-left" style="font-size: 70px; color: white;"></span> Previous
        </button>

        <button class="calendar-btn mx-10" @click="openCalendar">
          <span class="mdi mdi-calendar-month-outline" style="font-size: 40px; color: white;"></span>
        </button>

        <button class="timeline-btn" @click="nextMonth">
          Next <span class="mdi mdi-menu-right" style="font-size: 70px; color: white;"></span>
        </button>

        <!-- <div class="year-label">
          {{ currentDate.getFullYear() }}
        </div> -->
      </div>

      <!-- <button class="today-btn mt-2" @click="resetToToday">Today</button> -->
    </div>
    <v-dialog v-model="isCalendarOpen" width="350">
      <v-date-picker
        :model-value="currentDate"
        @update:modelValue="onDateSelect"
        color="black"
        font-size="20px"
      />
    </v-dialog>
    </div>
</template>

<script>
import { openBlock } from 'vue';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default {
  name: 'NEOTimeline',
  data() {
    return {
      eventList: [],
      selectedEvent: null,
      currentDate: new Date(),
      timelineDays: [],
      isCalendarOpen: false,
    };
  },
  methods: {
    generateTimeline() {
      this.timelineDays = [];
      for (let i = -10; i <= 10; i++) {
        const date = new Date(this.currentDate);
        date.setDate(this.currentDate.getDate() + i);
        const dayTitle = `${monthNames[date.getMonth()]} ${date.getDate()}`;
        this.timelineDays.push({ date, title: dayTitle });
      }
    },
    updateEventList() {
      this.eventList = [
        { id: 1, name: `Event for ${this.currentDate.toDateString()}` },
        { id: 2, name: "Another event" }
      ];
    },
    prevMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.generateTimeline();
      this.updateEventList();
    },
    nextMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.generateTimeline();
      this.updateEventList();
    },
    resetToToday() {
      this.currentDate = new Date();
      this.generateTimeline();
      this.updateEventList();
    },
    openCalendar() {
      this.isCalendarOpen = true;
    },
    onDateSelect(date) {
      this.currentDate = date;
      this.isCalendarOpen = false;
      this.generateTimeline();
      this.updateEventList();
    }
  },
  mounted() {
    this.generateTimeline();
    this.updateEventList(); // 初始化事件列表
  },
  updateEventList() {
      let requestDate = `${this.currentDate.getFullYear()}-${monthNames[this.currentDate.getMonth()]}-${String(this.currentDate.getDate()).padStart(2, '0')}`
      console.log(requestDate)
    },
};
</script>

<style scoped>
.container {
  margin: 20px 5%;
}

.event-selector {
  justify-content: center;
  align-items: center;
  text-align: center;
  font: 30px normal;
}

.event-details {
  display: flex;
  justify-content: space-between;
  height: 550px;
  gap: 30px;
}

.event-card {
  flex: 1;
  min-width: 300px;
  height: 100%;
  background: rgba(68, 68, 68, 0.5);
  padding: 15px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.timeline-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.timeline-btn {
  background-color: transparent;
  font-size: 20px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.calendar-btn {
  height: 80px;
  width: 80px;
  background-color: transparent; 
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* .today-btn {
  background-color: white;
  border: 2px solid white;
  color: black;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.3s ease;
} */

.today-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.calendar-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}


.year-label {
  display: flex;
  justify-content: right;
  margin: 0px 5%;
  padding-left: 10px;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.timeline-btn {
  display: flex;
  flex-direction: row; 
  justify-content: center;
  text-align: center;
  align-items: center;
  background-color: transparent;
  font: 30px bold;
  width: 150px;
}

.timeline {
  display: flex;
  justify-content: space-between;
  margin: 0px 5%;
}

/* .simple-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background-color: #ffffff;
  z-index: 1;
  transform: translateY(-50%);
} */

.neo-timeline .v-timeline-item {
  flex: 1;
  text-align: center;
}
</style>
