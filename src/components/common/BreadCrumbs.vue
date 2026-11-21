<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import { ChevronRight } from 'lucide-vue-next';

export interface BreadcrumbItem {
    label: string;
    to?: RouteLocationRaw;
}

defineProps<{
    items: BreadcrumbItem[];
}>();
</script>

<template>
    <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <template v-for="(item, index) in items" :key="index">
            <ChevronRight v-if="index > 0" class="h-4 w-4 shrink-0 text-slate-400" />

            <RouterLink v-if="item.to && index < items.length - 1" :to="item.to"
                class="rounded-md px-1.5 py-0.5 font-medium transition-colors hover:bg-slate-200/60 hover:text-[#2c3495]">
                {{ item.label }}
            </RouterLink>

            <span v-else class="px-1.5 py-0.5 font-semibold text-slate-900" aria-current="page">
                {{ item.label }}
            </span>
        </template>
    </nav>
</template>