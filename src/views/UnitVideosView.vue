<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';

import {
    ExternalLink,
    Play,
    Clock,
    BookOpen,
    CheckCircle2,
    Check
} from 'lucide-vue-next';

import Breadcrumbs from '@/components/common/BreadCrumbs.vue';
import { curriculumService } from '@/services/curriculumService';

import type {
    Book,
    Unit,
    UnitVideo,
    VideoCategory
} from '@/types/curriculum';

const route = useRoute();

const unit = ref<Unit | undefined>(undefined);
const book = ref<Book | undefined>(undefined);
const activeVideo = ref<UnitVideo | undefined>(undefined);
const watchedVideoIds = ref<string[]>([]);

const categoryLabels: Record<VideoCategory, { label: string; style: string }> = {
    grammar: { label: 'Gramática', style: 'bg-blue-50 text-[#2c3495]' },
    vocabulary: { label: 'Vocabulario', style: 'bg-amber-50 text-amber-700' },
    //   roleplay: { label: 'Role Play', style: 'bg-emerald-50 text-emerald-700' },
    phrases: { label: 'Frases', style: 'bg-purple-50 text-purple-700' },
};

const selectVideo = (video: UnitVideo) => {
    activeVideo.value = video;
};

const youtubeEmbedUrl = computed(() =>
    activeVideo.value
        ? `https://www.youtube.com/embed/${activeVideo.value.youtubeId}`
        : ''
);

const youtubeUrl = computed(() =>
    activeVideo.value
        ? `https://youtu.be/${activeVideo.value.youtubeId}`
        : ''
);

onMounted(async () => {
    const unitId = String(route.params.unitId || '');

    const result = await curriculumService.getUnitById(unitId);

    if (result) {
        unit.value = result;

        book.value = await curriculumService.getBookById(
            result.bookId
        );

        // Recuperar progreso guardado
        const savedProgress = localStorage.getItem(
            `naxxent:video-progress:${result.id}`
        );

        if (savedProgress) {
            try {
                const parsed: unknown = JSON.parse(savedProgress);

                if (Array.isArray(parsed)) {
                    const validVideoIds = new Set(
                        (result.videos ?? []).map(video => String(video.id))
                    );

                    watchedVideoIds.value = parsed
                        .filter((id): id is string => typeof id === 'string')
                        .filter(id => validVideoIds.has(id));
                }
            } catch {
                watchedVideoIds.value = [];
            }
        }

        if (result.videos?.length) {
            activeVideo.value = result.videos[0];
        }
    }
});


// Identificador independiente para cada unidad
const progressStorageKey = computed(() =>
    unit.value
        ? `naxxent:video-progress:${unit.value.id}`
        : ''
);

// Cantidad de videos completados
const completedCount = computed(() => {
    return unit.value?.videos?.filter(video =>
        watchedVideoIds.value.includes(String(video.id))
    ).length ?? 0;
});

// Total de videos
const totalVideos = computed(() => unit.value?.videos?.length ?? 0);

// Porcentaje de progreso
const progressPercent = computed(() => {
    if (!totalVideos.value) return 0;

    return Math.round(
        (completedCount.value / totalVideos.value) * 100
    );
});

// Comprobar si un video está completado
const isVideoWatched = (video: UnitVideo) => {
    return watchedVideoIds.value.includes(String(video.id));
};

const saveVideoProgress = () => {
    if (!progressStorageKey.value) return;

    localStorage.setItem(
        progressStorageKey.value,
        JSON.stringify(watchedVideoIds.value)
    );
};

const toggleVideoCompleted = (video: UnitVideo) => {
    const videoId = String(video.id);

    if (isVideoWatched(video)) {
        watchedVideoIds.value = watchedVideoIds.value.filter(
            id => id !== videoId
        );
    } else {
        watchedVideoIds.value.push(videoId);
    }

    saveVideoProgress();
};
</script>


<template>
    <section v-if="unit && book" class="space-y-5 pb-24 md:pb-8">

        <Breadcrumbs :items="[
            { label: 'Series', to: { name: 'books' } },
            { label: book.title, to: { name: 'book-units', params: { bookId: book.id } } },
            { label: `Unidad ${unit.number}`, to: { name: 'unit-hub', params: { unitId: unit.id } } },
            { label: 'Video Clases' },
        ]" />

        <!-- HEADER -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p class="text-xs font-bold uppercase tracking-wider text-[#2c3495]">
                    {{ book.title }} · Unidad {{ unit.number }}
                </p>

                <h1 class="mt-1 text-2xl font-extrabold text-slate-900">
                    {{ unit.title }}
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                    Aprende a través de nuestras video clases.
                </p>
            </div>

            <div class="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <BookOpen class="h-4 w-4" />
                {{ unit.videos?.length || 0 }} lecciones
            </div>
        </div>


        <!-- PROGRESO DE APRENDIZAJE -->
        <div class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

            <div class="flex items-center justify-between gap-3">

                <div>
                    <h3 class="text-sm font-bold text-slate-900">
                        Tu progreso en esta unidad
                    </h3>

                    <p class="mt-1 text-xs text-slate-500">
                        {{ completedCount }} de {{ totalVideos }} videos completados
                    </p>
                </div>

                <div class="text-right">
                    <span class="text-2xl font-extrabold text-[#2c3495]">
                        {{ progressPercent }}%
                    </span>
                </div>

            </div>

            <div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                <div class="h-full rounded-full bg-[#2c3495] transition-all duration-500"
                    :style="{ width: `${progressPercent}%` }" />

            </div>

            <p class="mt-2 text-[11px] text-slate-500">
                <template v-if="progressPercent === 100">
                    ¡Excelente! Has completado todas las video clases.
                </template>

                <template v-else>
                    Continúa aprendiendo y completa todas las lecciones.
                </template>
            </p>

        </div>


        <!-- VIDEO LEARNING CENTER -->
        <div v-if="activeVideo" class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">

            <!-- REPRODUCTOR -->
            <div class="min-w-0 space-y-4">

                <div class="overflow-hidden rounded-2xl bg-black shadow-lg">
                    <div class="aspect-video">
                        <iframe :src="youtubeEmbedUrl" :title="activeVideo.title" class="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen />
                    </div>
                </div>

                <!-- INFORMACION DEL VIDEO -->
                <div class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

                    <div class="flex flex-wrap items-center justify-between gap-3">

                        <span class="rounded-full px-3 py-1 text-xs font-bold"
                            :class="categoryLabels[activeVideo.category].style">
                            {{ categoryLabels[activeVideo.category].label }}
                        </span>

                        <a :href="youtubeUrl" target="_blank" rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2c3495] hover:underline">
                            <ExternalLink class="h-4 w-4" />
                            Ver en YouTube
                        </a>

                    </div>

                    <h2 class="mt-3 text-lg font-bold text-slate-900 sm:text-xl">
                        {{ activeVideo.title }}
                    </h2>

                    <p v-if="activeVideo.description" class="mt-2 text-sm leading-relaxed text-slate-600">
                        {{ activeVideo.description }}
                    </p>

                    <div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                        <Clock class="h-4 w-4" />
                        {{ activeVideo.duration || 'Duración no disponible' }}
                    </div>


                    <!-- ACCION DE COMPLETAR VIDEO -->
                    <div class="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">

                        <button type="button" @click="toggleVideoCompleted(activeVideo!)"
                            class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
                            :class="isVideoWatched(activeVideo!)
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-[#2c3495] text-white hover:bg-[#232b7a]'">

                            <CheckCircle2 v-if="isVideoWatched(activeVideo!)" class="h-4 w-4" />

                            <Check v-else class="h-4 w-4" />

                            {{
                                isVideoWatched(activeVideo!)
                                    ? 'Lección completada'
                            : 'Marcar como completada'
                            }}

                        </button>

                        <span v-if="isVideoWatched(activeVideo!)" class="text-xs font-medium text-emerald-600">
                            ¡Buen trabajo!
                        </span>

                    </div>


                </div>
            </div>

            <!-- PLAYLIST -->
            <aside class="overflow-hidden rounded-2xl border border-slate-200 bg-white">

                <div class="border-b border-slate-100 bg-slate-50 p-4">
                    <h3 class="font-bold text-slate-900">
                        Contenido de la unidad
                    </h3>

                    <p class="mt-1 text-xs text-slate-500">
                        Selecciona una lección para reproducirla.
                    </p>
                </div>

                <div class="divide-y divide-slate-100">

                    <button v-for="(video, index) in unit.videos" :key="video.id" type="button"
                        @click="selectVideo(video)"
                        class="flex w-full items-start gap-3 p-3 text-left transition-colors" :class="activeVideo.id === video.id
                            ? 'bg-[#2c3495]/5'
                            : 'hover:bg-slate-50'">

                        <!-- MINIATURA Y NUMERO -->
                        <div class="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-200">

                            <img :src="`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`" :alt="video.title"
                                loading="lazy" class="h-full w-full object-cover" />

                            <div class="absolute inset-0 flex items-center justify-center" :class="activeVideo.id === video.id
                                ? 'bg-[#2c3495]/50'
                                : 'bg-black/20'">
                                <CheckCircle2 v-if="isVideoWatched(video)" class="h-6 w-6 text-emerald-400" />

                                <Play v-else-if="activeVideo.id === video.id" class="h-6 w-6 fill-white text-white" />

                                <span v-else class="rounded bg-black/70 px-1.5 py-0.5 text-xs font-bold text-white">
                                    {{ index + 1 }}
                                </span>
                            </div>
                        </div>

                        <!-- DETALLES -->
                        <div class="min-w-0 flex-1">

                            <span class="text-[10px] font-bold uppercase" :class="activeVideo.id === video.id
                                ? 'text-[#2c3495]'
                                : 'text-slate-400'">
                                {{ categoryLabels[video.category].label }}
                            </span>

                            <p class="mt-1 line-clamp-2 text-xs font-bold leading-snug" :class="activeVideo.id === video.id
                                ? 'text-[#2c3495]'
                                : 'text-slate-800'">
                                {{ video.title }}
                            </p>

                            <span class="mt-1 block text-[10px] text-slate-400">
                                {{ video.duration || 'Video clase' }}
                            </span>

                        </div>

                    </button>

                </div>
            </aside>

        </div>

        <!-- SIN VIDEOS -->
        <div v-else
            class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <Play class="h-10 w-10 text-slate-300" />

            <h3 class="mt-3 font-bold text-slate-800">
                No hay videos disponibles
            </h3>

            <p class="mt-1 text-sm text-slate-500">
                Las video clases de esta unidad estarán disponibles próximamente.
            </p>
        </div>

    </section>
</template>
