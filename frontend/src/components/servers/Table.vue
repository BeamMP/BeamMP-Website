<template>
  <div class="table-container">
    <table class="min-w-full divide-y divide-gray-400">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" class="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in data" :key="item.id">
          <tr class="bg-slate-300" @click="selectRow(item.id)" v-bind:class="(item.raw.official)?'bg-orange-300':''">
            <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-600">
              <template v-if="column.key == 'name'">
                <span v-for="(value, name) in item[column.key]" :style="value.f">{{ value.s }}</span>
              </template>
              <template v-else>
                {{ item[column.key] }}
              </template>
            </td>
          </tr>
          <tr v-if="selectedRow == item.id">
            <td :colspan="columns.length">
              <ExpandedRowDetails :rowData="getExpandedRowData(selectedRow)" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import ExpandedRowDetails from "@/components/servers/ExpandedRowDetails.vue";

export default {
  components: {
    ExpandedRowDetails,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedRow: null,
    };
  },
  methods: {
    selectRow(id) {
      if (this.selectedRow === id) {
        this.selectedRow = null;
      } else {
        this.selectedRow = id;
      }
    },
    getExpandedRowData(id) {
      // Find the row data for the expanded row
      return this.data.find(item => item.id === id) || {};
    },
  },
};
</script>

<style scoped>
.table-container {
  overflow-x: auto;
}
</style>
