<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BookOpen, Clock, Sparkles, ArrowRight, Lock } from 'lucide-vue-next';
import { curriculumService } from '@/services/curriculumService';
import type { AccentTheme, BookSeries } from '@/types/curriculum';

const router = useRouter();
const seriesList = ref<BookSeries[]>([]);

const themeStyles: Record<
    AccentTheme,
    {
        headerBg: string;
        title: string;
        button: string;
    }
> = {
    blue: {
        headerBg: 'from-blue-100/80 via-sky-50 to-slate-200/70',
        title: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30',
    },
    emerald: {
        headerBg: 'from-emerald-100/80 via-teal-50 to-slate-200/70',
        title: 'text-emerald-600',
        button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30',
    },
    purple: {
        headerBg: 'from-purple-100/80 via-fuchsia-50 to-slate-200/70',
        title: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30',
    },
};

const exploreSeries = (series: BookSeries) => {
    if (series.status !== 'active') return;
    router.push({ name: 'series-detail', params: { seriesId: series.id } });
};

onMounted(async () => {
    seriesList.value = await curriculumService.getSeries();
});
</script>

<template>
    <section class="space-y-10">
        <!-- Encabezado centrado -->
        <div class="mx-auto max-w-2xl text-center">
            <h1 class="text-3xl font-extrabold tracking-tight text-[#2c3495] sm:text-4xl">
                Series de Libros
            </h1>
            <p class="mt-2 text-sm text-slate-600 sm:text-base">
                Descubre nuestra colección completa de materiales educativos diseñados para impulsar tu aprendizaje
            </p>
        </div>

        <!-- Grid de 3 Tarjetas de Series -->
        <div class="grid gap-6 md:grid-cols-3">
            <article v-for="series in seriesList" :key="series.id"
                class="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <!-- Cabecera con imagen y badge de estado -->
                <div class="relative h-48 w-full overflow-hidden bg-linear-to-br"
                    :class="themeStyles[series.accentTheme].headerBg">
                    <img v-if="series.coverImage" :src="series.coverImage" :alt="series.title"
                        class="h-full w-full object-cover opacity-90 mix-blend-multiply" loading="lazy" />

                    <span
                        class="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
                        :class="series.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'">
                        <span class="h-1.5 w-1.5 rounded-full bg-white" />
                        {{ series.status === 'active' ? 'Disponible' : 'Próximamente' }}
                    </span>
                </div>

                <!-- Cuerpo de la tarjeta -->
                <div class="flex flex-1 flex-col justify-between p-6">
                    <div>
                        <h2 class="text-xl font-extrabold tracking-tight"
                            :class="themeStyles[series.accentTheme].title">
                            {{ series.title }}
                        </h2>

                        <div class="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Sparkles class="h-3.5 w-3.5" />
                            <span>{{ series.levelRange }}</span>
                        </div>

                        <p class="mt-3 text-sm leading-relaxed text-slate-600">
                            {{ series.description }}
                        </p>
                    </div>

                    <!-- Metadatos y Botón -->
                    <div class="mt-6 space-y-4">
                        <div class="flex items-center gap-3 text-xs font-medium text-slate-500">
                            <span class="inline-flex items-center gap-1">
                                <BookOpen class="h-3.5 w-3.5" />
                                {{ series.booksCount }} Libros
                            </span>
                            <span class="text-slate-300">•</span>
                            <span class="inline-flex items-center gap-1">
                                <Clock class="h-3.5 w-3.5" />
                                Serie Completa
                            </span>
                        </div>

                        <button v-if="series.status === 'active'" type="button" @click="exploreSeries(series)"
                            class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all sm:w-auto"
                            :class="themeStyles[series.accentTheme].button">
                            <span>Explorar Serie</span>
                            <ArrowRight class="h-4 w-4" />
                        </button>

                        <button v-else type="button" disabled
                            class="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-400 sm:w-auto">
                            <Lock class="h-4 w-4" />
                            <span>Próximamente</span>
                        </button>
                    </div>
                </div>
            </article>
        </div>
    </section>
</template>