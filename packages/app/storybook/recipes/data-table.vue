<template>
  <STable v-model:items-per-page="itemsPerPage" :headers="headers" :items="employees" outlined>
    <template #item.status="{ item }">
      <SChip :color="item.status === 'Active' ? 'success' : 'warning'" size="small">{{ item.status }}</SChip>
    </template>
    <template #item.salary="{ item }">{{ formatSalary(item.salary) }}</template>
  </STable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { STable, SChip, type TableHeader } from '@khsura/sui'

interface Employee {
  id: number
  name: string
  department: string
  status: 'Active' | 'On leave'
  salary: number
}

const DEFAULT_ITEMS_PER_PAGE = 10
const DEPARTMENTS = ['Engineering', 'Design', 'Sales', 'Support']
const EMPLOYEE_COUNT = 24
const BASE_SALARY = 4000
const SALARY_STEP = 150
const ON_LEAVE_EVERY = 5

// `value` is the item field and the slot suffix (#item.status); a column sorts only with `sortable: true`.
const headers: TableHeader[] = [
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Department', value: 'department', sortable: true },
  { text: 'Status', value: 'status' },
  { text: 'Salary', value: 'salary', sortable: true, align: 'end' },
]

const employees: Employee[] = Array.from({ length: EMPLOYEE_COUNT }, (_, index) => ({
  id: index + 1,
  name: `Employee ${index + 1}`,
  department: DEPARTMENTS[index % DEPARTMENTS.length] ?? 'Engineering',
  status: index % ON_LEAVE_EVERY === 0 ? 'On leave' : 'Active',
  salary: BASE_SALARY + index * SALARY_STEP,
}))

// The pager renders only when v-model:items-per-page is bound.
const itemsPerPage = ref(DEFAULT_ITEMS_PER_PAGE)
const salaryFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const formatSalary = (salary: number) => salaryFormatter.format(salary)
</script>
