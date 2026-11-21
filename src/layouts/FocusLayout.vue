<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
    <div class="min-h-screen bg-slate-50 text-slate-900">
        <main class="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6">
            <RouterView />
        </main>
    </div>
</template>