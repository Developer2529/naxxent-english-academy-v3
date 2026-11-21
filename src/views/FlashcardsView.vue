<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    X,
    Volume2,
    RotateCw,
    Check,
    RefreshCw,
    Trophy,
} from 'lucide-vue-next';
import { curriculumService } from '@/services/curriculumService';
import type { Unit, VocabularyItem } from '@/types/curriculum';

const route = useRoute();
const router = useRouter();

const unit = ref<Unit | undefined>(undefined);
const deck = ref<VocabularyItem[]>([]);
const currentIndex = ref(0);
const isFlipped = ref(false);
const isFinished = ref(false);

// Guardamos los IDs de las palabras que el estudiante marcó para repasar
const reviewIds = ref<string[]>([]);

const currentCard = computed<VocabularyItem | undefined>(() => deck.value[currentIndex.value]);

const progressPercent = computed(() => {
    if (deck.value.length === 0) return 0;
    return Math.round(((currentIndex.value + (isFinished.value ? 1 : 0)) / deck.value.length) * 100);
});

const knownCount = computed(() => deck.value.length - reviewIds.value.length);

// Pronunciación nativa del navegador (gratis y funciona offline en muchos dispositivos)
const speak = (text: string, event?: Event) => {
    event?.stopPropagation(); // Evita que la tarjeta se voltee al tocar el botón de audio
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Un poco más lento para estudiantes A1/A2
    window.speechSynthesis.speak(utterance);
};

const flipCard = () => {
    isFlipped.value = !isFlipped.value;
};

const handleAnswer = (needsReview: boolean) => {
    if (!currentCard.value) return;

    if (needsReview && !reviewIds.value.includes(currentCard.value.id)) {
        reviewIds.value.push(currentCard.value.id);
    }

    if (currentIndex.value < deck.value.length - 1) {
        currentIndex.value++;
        isFlipped.value = false;
    } else {
        isFinished.value = true;
    }
};

const restartAll = () => {
    if (!unit.value) return;
    deck.value = [...unit.value.vocabulary];
    currentIndex.value = 0;
    reviewIds.value = [];
    isFlipped.value = false;
    isFinished.value = false;
};

const practiceReviewOnly = () => {
    if (!unit.value) return;
    deck.value = unit.value.vocabulary.filter((item) => reviewIds.value.includes(item.id));
    currentIndex.value = 0;
    reviewIds.value = [];
    isFlipped.value = false;
    isFinished.value = false;
};

const exitToHub = () => {
    window.speechSynthesis?.cancel();
    router.push({ name: 'unit-hub', params: { unitId: route.params.unitId } });
};

onMounted(async () => {
    const unitId = String(route.params.unitId || '');
    const result = await curriculumService.getUnitById(unitId);
    if (result) {
        unit.value = result;
        deck.value = [...result.vocabulary];
    }
});

interface TextPart {
    text: string;
    highlighted: boolean;
}

const parseHighlights = (input: string): TextPart[] => {
    return input.split(/(\*\*.*?\*\*)/g).map((part) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return { text: part.slice(2, -2), highlighted: true };
        }
        return { text: part, highlighted: false };
    });
};

// Limpia los asteriscos antes de enviarlo al sintetizador de voz
const speakClean = (text: string, event?: Event) => {
    speak(text.replace(/\*\*/g, ''), event);
};
</script>

<template>
    <div v-if="unit" class="flex flex-1 flex-col justify-between gap-6">
        <!-- BARRA SUPERIOR: Cerrar + Progreso -->
        <header class="space-y-3">
            <div class="flex items-center justify-between">
                <button type="button" @click="exitToHub"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    aria-label="Salir">
                    <X class="h-5 w-5" />
                </button>

                <div class="text-center">
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Unidad {{ unit.number }} · Vocabulario
                    </p>
                    <p v-if="!isFinished" class="text-sm font-bold text-slate-800">
                        {{ currentIndex + 1 }} de {{ deck.length }}
                    </p>
                </div>

                <div class="w-10" />
            </div>

            <!-- Barra de progreso -->
            <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div class="h-full rounded-full bg-[#2c3495] transition-all duration-300"
                    :style="{ width: `${progressPercent}%` }" />
            </div>
        </header>

        <!-- PANTALLA DE RESUMEN AL TERMINAR -->
        <section v-if="isFinished"
            class="flex flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#2c3495]">
                <Trophy class="h-8 w-8" />
            </div>

            <h1 class="mt-4 text-2xl font-bold text-slate-900">¡Sesión completada!</h1>
            <p class="mt-1 text-sm text-slate-600">
                Dominaste <strong>{{ knownCount }}</strong> de <strong>{{ deck.length }}</strong> palabras.
            </p>

            <div class="mt-8 flex w-full flex-col gap-3">
                <button v-if="reviewIds.length > 0" type="button" @click="practiceReviewOnly"
                    class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f32c2b] py-3.5 text-sm font-semibold text-white hover:opacity-90">
                    <RefreshCw class="h-4 w-4" />
                    <span>Repasar solo las {{ reviewIds.length }} difíciles</span>
                </button>

                <button type="button" @click="restartAll"
                    class="w-full rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Practicar todas de nuevo
                </button>

                <button type="button" @click="exitToHub"
                    class="w-full rounded-xl bg-[#2c3495] py-3.5 text-sm font-semibold text-white hover:opacity-90">
                    Volver a la Unidad
                </button>
            </div>
        </section>

        <!-- TARJETA INTERACTIVA -->
        <template v-else-if="currentCard">
            <div class="flex flex-1 items-center">
                <div role="button" tabindex="0" @click="flipCard" @keydown.space.prevent="flipCard"
                    class="flex min-h-90 w-full cursor-pointer flex-col justify-between rounded-3xl border-2 bg-white p-6 shadow-sm transition-all select-none sm:p-8"
                    :class="isFlipped ? 'border-[#2c3495]' : 'border-slate-200 hover:border-slate-300'">
                    <!-- Encabezado de la tarjeta -->
                    <div class="flex items-center justify-between">
                        <span
                            class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                            {{ currentCard.partOfSpeech }}
                        </span>

                        <button type="button" @click="
                            speakClean(
                                currentCard.qa
                                    ? `${currentCard.word}. ${currentCard.qa.question} ${currentCard.qa.answer}`
                                    : `${currentCard.word}. ${currentCard.exampleEn || ''}`,
                                $event,
                            )
                            "
                            class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#2c3495] transition-colors hover:bg-[#2c3495] hover:text-white"
                            aria-label="Escuchar pronunciación">
                            <Volume2 class="h-5 w-5" />
                        </button>
                    </div>

                    <!-- FRENTE: Diseño tipo diapositiva (Texto + Imagen opcional) -->
                    <div v-if="!isFlipped" class="my-6 grid items-center gap-6"
                        :class="currentCard.imageUrl ? 'md:grid-cols-2' : 'mx-auto max-w-lg text-center'">
                        <!-- Columna de Texto -->
                        <div class="space-y-6">
                            <div>
                                <h2 class="text-3xl font-extrabold uppercase tracking-wide text-[#f32c2b] sm:text-4xl">
                                    {{ currentCard.word }}
                                </h2>
                                <p v-if="currentCard.phonetic" class="mt-1 font-mono text-sm text-slate-400">
                                    {{ currentCard.phonetic }}
                                </p>
                            </div>

                            <!-- Caso A: Pregunta y Respuesta -->
                            <div v-if="currentCard.qa" class="space-y-4">
                                <div>
                                    <p class="text-xs font-bold uppercase tracking-wider text-slate-900">Question:</p>
                                    <p class="mt-1 text-lg text-slate-700">
                                        <span v-for="(part, idx) in parseHighlights(currentCard.qa.question)" :key="idx"
                                            :class="part.highlighted ? 'font-bold text-[#f32c2b]' : ''">
                                            {{ part.text }}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <p class="text-xs font-bold uppercase tracking-wider text-slate-900">Answer:</p>
                                    <p class="mt-1 text-lg text-slate-700">
                                        <span v-for="(part, idx) in parseHighlights(currentCard.qa.answer)" :key="idx"
                                            :class="part.highlighted ? 'font-bold text-[#f32c2b]' : ''">
                                            {{ part.text }}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <!-- Caso B: Oración de ejemplo -->
                            <p v-else-if="currentCard.exampleEn" class="text-lg leading-relaxed text-slate-700">
                                <span v-for="(part, idx) in parseHighlights(currentCard.exampleEn)" :key="idx"
                                    :class="part.highlighted ? 'font-bold text-[#f32c2b]' : ''">
                                    {{ part.text }}
                                </span>
                            </p>
                        </div>

                        <!-- Columna de Imagen (Solo se renderiza si existe imageUrl) -->
                        <div v-if="currentCard.imageUrl" class="overflow-hidden rounded-2xl bg-slate-100">
                            <img :src="currentCard.imageUrl" :alt="currentCard.word"
                                class="h-52 w-full object-cover sm:h-64" loading="lazy" />
                        </div>
                    </div>

                    <!-- REVERSO: Traducción al español -->
                    <div v-else class="my-6 space-y-5 text-center">
                        <div>
                            <span class="text-xs font-semibold uppercase tracking-wider text-[#2c3495]">
                                Traducción
                            </span>
                            <h2 class="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                {{ currentCard.translation }}
                            </h2>
                        </div>

                        <div class="mx-auto max-w-md rounded-2xl bg-slate-50 p-4 text-left">
                            <template v-if="currentCard.qa">
                                <p class="text-sm font-semibold text-slate-800">{{ currentCard.qa.questionEs }}</p>
                                <p class="mt-2 text-sm text-slate-600">{{ currentCard.qa.answerEs }}</p>
                            </template>
                            <p v-else-if="currentCard.exampleEs" class="text-sm text-slate-700">
                                {{ currentCard.exampleEs }}
                            </p>
                        </div>
                    </div>

                    <!-- Indicador inferior -->
                    <div class="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400">
                        <RotateCw class="h-3.5 w-3.5" />
                        <span>{{ isFlipped ? 'Toca para volver a la tarjeta' : 'Toca para ver traducción en español'
                        }}</span>
                    </div>
                </div>
            </div>
            <!-- CONTROLES DE AUTOEVALUACIÓN -->
            <footer class="grid grid-cols-2 gap-3 pb-2">
                <button type="button" @click="handleAnswer(true)"
                    class="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-4 text-sm font-bold text-[#f32c2b] transition-colors hover:bg-red-100">
                    <RefreshCw class="h-4 w-4" />
                    <span>Repasar luego</span>
                </button>

                <button type="button" @click="handleAnswer(false)"
                    class="flex items-center justify-center gap-2 rounded-2xl bg-[#2c3495] py-4 text-sm font-bold text-white transition-opacity hover:opacity-90">
                    <Check class="h-4 w-4" />
                    <span>¡La domino!</span>
                </button>
            </footer>
        </template>
    </div>
</template>