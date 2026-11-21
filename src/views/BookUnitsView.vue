<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronRight, Lock } from 'lucide-vue-next';
import { curriculumService } from '@/services/curriculumService';
import type { Book, Unit } from '@/types/curriculum';
import BreadCrumbs from '@/components/common/BreadCrumbs.vue';


const route = useRoute();
const router = useRouter();

const book = ref<Book | undefined>(undefined);
const availableUnits = ref<Unit[]>([]);

// Combina las unidades reales con el resto de espacios hasta completar book.totalUnits
const unitSlots = computed(() => {
    if (!book.value) return [];

    return Array.from({ length: book.value.totalUnits }, (_, index) => {
        const unitNumber = index + 1;
        const found = availableUnits.value.find((u) => u.number === unitNumber);
        return {
            number: unitNumber,
            unit: found,
        };
    });
});

const goToUnit = (unitId: string) => {
    router.push({ name: 'unit-hub', params: { unitId } });
};


onMounted(async () => {
    const bookId = String(route.params.bookId || '');
    book.value = await curriculumService.getBookById(bookId);
    availableUnits.value = await curriculumService.getUnitsByBook(bookId);
});
</script>

<template>
    <section class="space-y-6">
        <!-- Botón volver -->
        <BreadCrumbs v-if="book" :items="[
            { label: 'Series', to: { name: 'books' } },
            { label: 'Libros', to: { name: 'series-detail', params: { seriesId: book.seriesId } } },
            { label: book.title },
        ]" />

        <template v-if="book">
            <!-- Banner del Libro -->
            <div class="flex flex-col justify-between gap-4 rounded-3xl bg-linear-to-r p-6 text-white shadow-sm sm:flex-row sm:items-center"
                :class="book.fallbackGradient">
                <div>
                    <span class="inline-block rounded-md bg-black/30 px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm">
                        MCER {{ book.cefr }} · {{ book.totalUnits }} Unidades
                    </span>
                    <h1 class="mt-2 text-2xl font-extrabold sm:text-3xl">{{ book.title }}</h1>
                    <p class="text-sm text-white/90">{{ book.subtitle }}</p>
                </div>

                <span v-if="book.badge"
                    class="w-fit rounded-full bg-[#f32c2b] px-3 py-1 text-xs font-bold text-white shadow">
                    Versión {{ book.badge }}
                </span>
            </div>

            <!-- Cuadrícula con TODAS las unidades del libro -->
            <div class="grid gap-3 sm:grid-cols-2">
                <template v-for="slot in unitSlots" :key="slot.number">
                    <!-- Unidad disponible -->
                    <button v-if="slot.unit" type="button" @click="goToUnit(slot.unit.id)"
                        class="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-[#2c3495] hover:shadow-sm">
                        <div class="flex items-center gap-4">
                            <div
                                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2c3495] text-sm font-bold text-white">
                                U{{ slot.number }}
                            </div>
                            <div>
                                <h2 class="font-bold text-slate-900">{{ slot.unit.title }}</h2>
                                <p class="text-xs text-slate-500">{{ slot.unit.topic }}</p>
                            </div>
                        </div>

                        <ChevronRight class="h-5 w-5 shrink-0 text-slate-400" />
                    </button>

                    <!-- Unidad bloqueada / Próximamente -->
                    <div v-else
                        class="flex w-full cursor-not-allowed items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-100/70 p-4 opacity-70">
                        <div class="flex items-center gap-4">
                            <div
                                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-300 text-sm font-bold text-slate-600">
                                U{{ slot.number }}
                            </div>
                            <div>
                                <h2 class="font-semibold text-slate-600">Unidad {{ slot.number }}</h2>
                                <p class="text-xs text-slate-400">Contenido en preparación</p>
                            </div>
                        </div>

                        <Lock class="h-4 w-4 shrink-0 text-slate-400" />
                    </div>
                </template>
            </div>
        </template>
    </section>
</template>