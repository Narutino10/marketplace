<template>
  <div class="table-container">
    <div class="table-controls">
      <button class="btn-export" @click="exportCSV">Exporter CSV</button>
      <button class="btn-delete" @click="deleteSelected" :disabled="selectedItems.length === 0">Supprimer la sélection</button>
    </div>
    <div class="table-responsive">
      <table>
        <thead>
        <tr>
          <th class="checkbox-column"><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
          <th v-for="column in columns" :key="column.key">
            <div class="table-header">
              {{ column.label }}
              <button class="btn-sort" @click="sort(column.key)">Trier</button>
              <input v-if="column.searchable" class="input-search" :placeholder="`Rechercher ${column.label}`" @input="search(column.key, $event)" />
            </div>
          </th>
          <th class="actions-column">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in paginatedItems" :key="item._id">
          <td class="checkbox-column"><input type="checkbox" v-model="selectedItems" :value="item._id" /></td>
          <td v-for="column in columns" :key="column.key" :data-label="column.label">
            {{ column.formatter ? column.formatter(item[column.key]) : item[column.key] }}
          </td>
          <td class="actions-column">
            <div class="table-actions">
              <button class="btn-view" @click="viewItem(item)">Voir</button>
              <button class="btn-edit" @click="editItem(item)">Modifier</button>
              <DeleteButton :onDelete="() => deleteItem(item)" />
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button class="btn-pagination" @click="prevPage" :disabled="currentPage === 1">Précédent</button>
      <span class="pagination-text">Page {{ currentPage }} sur {{ totalPages }}</span>
      <button class="btn-pagination" @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DeleteButton from "@/components/common/DeteleButton.vue";

interface Column<T> {
  key: keyof T & string;
  label: string;
  formatter?: (value: any) => string;
  searchable?: boolean;
}

const props = defineProps<{
  items: any[];
  columns: Column<any>[];
  itemsPerPage: number;
  onView: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => Promise<void>;
}>();

const currentPage = ref(1);
const sortKey = ref<string>('');
const sortOrder = ref<'asc' | 'desc'>('asc');
const searchFilters = ref<Record<string, string>>({});
const selectedItems = ref<string[]>([]);
const selectAll = ref(false);

const filteredItems = computed(() => {
  return props.items.filter(item =>
      Object.entries(searchFilters.value).every(([key, value]) =>
          String(item[key]).toLowerCase().includes(value.toLowerCase())
      )
  );
});

const sortedItems = computed(() => {
  if (!sortKey.value) return filteredItems.value;
  return [...filteredItems.value].sort((a, b) => {
    if (a[sortKey.value] < b[sortKey.value]) return sortOrder.value === 'asc' ? -1 : 1;
    if (a[sortKey.value] > b[sortKey.value]) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const totalPages = computed(() => Math.ceil(sortedItems.value.length / props.itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return sortedItems.value.slice(start, end);
});

const sort = (key: keyof any & string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const search = (key: keyof any & string, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  if (value) {
    searchFilters.value[key] = value;
  } else {
    delete searchFilters.value[key];
  }
  currentPage.value = 1;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const viewItem = (item: any) => props.onView(item);
const editItem = (item: any) => props.onEdit(item);
const deleteItem = async (item: any) => {
  await props.onDelete(item);
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = sortedItems.value.map(item => item._id);
  } else {
    selectedItems.value = [];
  }
};

const deleteSelected = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer les produits sélectionnés ?')) {
    for (const id of selectedItems.value) {
      const item = props.items.find(i => i._id === id);
      if (item) await props.onDelete(item);
    }
    selectedItems.value = [];
  }
};

const exportCSV = () => {
  const headers = props.columns.map(col => col.label).join(',');
  const rows = selectedItems.value.length > 0
      ? props.items.filter(item => selectedItems.value.includes(item._id))
      : props.items;
  const csv = [
    headers,
    ...rows.map(item => props.columns.map(col => item[col.key]).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
</script>

<style scoped>
.table-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f9fafb;
  border: 1px solid #dfe1e5;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-export,
.btn-delete {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn-delete:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.btn-export:hover,
.btn-delete:hover:not(:disabled) {
  background-color: #45a049;
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: #333;
}

thead {
  background-color: #f2f2f2;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  position: relative;
}

.table-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.btn-sort {
  background-color: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  margin-left: 10px;
}

.btn-sort:hover {
  text-decoration: underline;
}

.input-search {
  margin-top: 5px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

.input-search:focus {
  outline: none;
  border-color: #007bff;
}

.actions-column .table-actions {
  display: flex;
  gap: 5px;
}

.btn-view,
.btn-edit,
.btn-delete {
  padding: 5px 10px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 2px;
}

.btn-view {
  background-color: #4CAF50;
}

.btn-edit {
  background-color: #FFC107;
}

.btn-delete {
  background-color: #F44336;
}

.btn-view:hover {
  background-color: #45a049;
}

.btn-edit:hover {
  background-color: #e0a800;
}

.btn-delete:hover {
  background-color: #e53935;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.btn-pagination {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
}

.pagination-text {
  font-size: 14px;
  vertical-align: middle;
}

@media screen and (max-width: 600px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    margin-bottom: 15px;
  }

  td {
    border: none;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    content: attr(data-label);
    position: absolute;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    font-weight: bold;
  }

  .checkbox-column, .actions-column {
    padding-left: 15px;
  }

  .table-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .table-actions button {
    margin: 2px;
  }
}
</style>
