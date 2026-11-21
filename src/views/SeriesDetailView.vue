<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Lock, Sparkles, ArrowRight, BookOpen } from 'lucide-vue-next';
import { curriculumService } from '@/services/curriculumService';
import type { Book, BookSeries } from '@/types/curriculum';
import BreadCrumbs from '@/components/common/BreadCrumbs.vue';

const route = useRoute();
const router = useRouter();

const series = ref<BookSeries | undefined>(undefined);
const books = ref<Book[]>([]);

const activeCount = computed(() => books.value.filter(b => b.status === 'active').length);

const openBook = (book: Book) => {
    if (book.status !== 'active') return;
    router.push({ name: 'book-units', params: { bookId: book.id } });
};

onMounted(async () => {
    const seriesId = String(route.params.seriesId || '');
    series.value = await curriculumService.getSeriesById(seriesId);
    books.value = await curriculumService.getBooksBySeries(seriesId);
});



const bookColors: Record<string, {
    header: string;
    body: string;
    action: string;
}> = {
    Intro: {
        header: 'bg-amber-400',
        body: 'bg-amber-50',
        action: 'bg-amber-600 hover:bg-amber-700'
    },
    '1': {
        header: 'bg-rose-500',
        body: 'bg-rose-50',
        action: 'bg-rose-600 hover:bg-rose-700'
    },
    '2': {
        header: 'bg-blue-500',
        body: 'bg-blue-50',
        action: 'bg-blue-600 hover:bg-blue-700'
    },
    '3': {
        header: 'bg-emerald-500',
        body: 'bg-emerald-50',
        action: 'bg-emerald-600 hover:bg-emerald-700'
    },
    P1: {
        header: 'bg-violet-500',
        body: 'bg-violet-50',
        action: 'bg-violet-600 hover:bg-violet-700'
    },
    P2: {
        header: 'bg-teal-600',
        body: 'bg-teal-50',
        action: 'bg-teal-700 hover:bg-teal-800'
    }
};

const getBookColor = (book: Book) => {
    return bookColors[book.levelLabel] ?? {
        header: 'bg-indigo-500',
        body: 'bg-indigo-50',
        action: 'bg-indigo-700 hover:bg-indigo-800'
    };
};


</script>

<template>
    <section class="space-y-6 pb-24 md:pb-8">
        <BreadCrumbs :items="[
            { label: 'Series', to: { name: 'books' } },
            { label: series?.title || 'Libros' },
        ]" />

        <!-- Header con acento -->
        <div v-if="series"
            class="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#2c3495] to-[#4a54c9] p-5 text-white shadow-lg sm:p-7">
            <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
            <div class="absolute -bottom-12 right-20 h-32 w-32 rounded-full bg-[#f32c2b]/20 blur-2xl"></div>

            <div class="relative flex items-start justify-between gap-4">
                <div class="space-y-1.5">
                    <p class="text-[11px] font-semibold uppercase tracking-widest text-white/70">Serie</p>
                    <h1 class="text-2xl font-extrabold sm:text-4xl">{{ series.title }}</h1>
                    <p class="max-w-xl text-sm text-white/80">
                        Selecciona tu libro actual. Por ahora
                        <strong class="text-white">Level Intro</strong> está disponible en fase Beta.
                    </p>
                </div>
                <div class="hidden shrink-0 rounded-2xl bg-white/15 px-4 py-3 text-center backdrop-blur-sm sm:block">
                    <p class="text-2xl font-black leading-none">{{ activeCount }}/{{ books.length }}</p>
                    <p class="mt-1 text-[11px] font-medium text-white/80">disponibles</p>
                </div>
            </div>
        </div>


        <div class="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">

            <button v-for="(book, i) in books" :key="book.id" type="button" :disabled="book.status !== 'active'"
                @click="openBook(book)" :style="{ animationDelay: `${i * 50}ms` }" class="book-card group flex min-w-0 flex-col overflow-hidden
               rounded-2xl border border-slate-200/80 bg-white
               text-left shadow-sm transition-all duration-200
               focus-visible:outline-2 focus-visible:outline-offset-2
               focus-visible:outline-[#2c3495]" :class="book.status === 'active'
                ? 'cursor-pointer hover:-translate-y-1 hover:border-[#2c3495]/40 hover:shadow-lg'
                : 'cursor-not-allowed opacity-80'">

                <!-- PORTADA -->
                <div class="relative h-20 overflow-hidden sm:h-28" :class="getBookColor(book).header">
                    <!-- Imagen del libro -->
                    <img v-if="book.coverImage" :src="book.coverImage" :alt="book.title" loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover" />

                    <!-- Capa sutil -->
                    <div class="absolute inset-0 bg-black/10"></div>

                    <!-- Información superior -->
                    <div class="relative z-10 flex items-center justify-between p-2.5 sm:p-3.5">

                        <span class="rounded-md bg-black/30 px-2 py-1
                             text-[10px] font-bold text-white backdrop-blur-sm">
                            {{ book.cefr }}
                        </span>

                        <span v-if="book.badge" class="inline-flex items-center gap-1 rounded-full
                           bg-white px-2 py-1 text-[9px] font-bold
                           text-[#f32c2b] shadow-sm sm:text-[10px]">
                            <Sparkles class="h-3 w-3" />
                            {{ book.badge }}
                        </span>

                        <span v-else-if="book.status === 'coming-soon'" class="inline-flex items-center gap-1 rounded-full
                           bg-white/90 px-2 py-1 text-[9px] font-semibold
                           text-slate-600 sm:text-[10px]">
                            <Lock class="h-3 w-3" />
                            Próximamente
                        </span>

                    </div>

                    <!-- Identificador del nivel -->
                    <div v-if="!book.coverImage" class="absolute bottom-1.5 left-3 z-10 sm:bottom-2 sm:left-4">
                        <span class="text-2xl font-bold tracking-tight
                             text-white sm:text-4xl">
                            {{ book.levelLabel }}
                        </span>
                    </div>
                </div>

                <!-- INFORMACIÓN -->
                <div :class="getBookColor(book).body" class="flex flex-1 flex-col justify-between gap-3 p-3 sm:p-4">

                    <div class="min-w-0">
                        <h2 class="line-clamp-2 text-[13px] font-bold leading-snug
                           sm:text-base" :class="book.status === 'active'
                            ? 'text-slate-500'
                            : 'text-slate-400'">
                            {{ book.title }}
                        </h2>

                        <p class="mt-1 hidden truncate text-xs text-slate-500 sm:block">
                            {{ book.subtitle }}
                        </p>
                    </div>

                    <!-- PIE DE TARJETA -->
                    <div class="flex items-center justify-between gap-1 border-t
                        border-slate-100 pt-2.5">

                        <span class="flex items-center gap-1 text-[10px]
                             font-medium text-slate-500 sm:text-xs">
                            <BookOpen class="h-3.5 w-3.5 shrink-0" />
                            {{ book.totalUnits }} unidades
                        </span>

                        <span v-if="book.status === 'active'" class="flex shrink-0 items-center gap-1 text-[11px]
                           font-bold text-[#2c3495] transition-all
                           group-hover:gap-2 sm:text-xs">
                            Abrir
                            <ArrowRight class="h-3.5 w-3.5" />
                        </span>

                        <span v-else class="text-[10px] font-medium text-slate-400">
                            No disponible
                        </span>

                    </div>
                </div>

            </button>
        </div>

    </section>
</template>

<style scoped>
.book-card {
    animation: card-in 0.35s ease-out both;
}

@keyframes card-in {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .book-card {
        animation: none;
        transition: none;
    }
}
</style>