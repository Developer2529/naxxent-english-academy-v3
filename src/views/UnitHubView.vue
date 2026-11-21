<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BreadCrumbs from '@/components/common/BreadCrumbs.vue';
import type { Book } from '@/types/curriculum';
import {
    Layers,
    BookText,
    FileText,
    HelpCircle,
    Play,
} from 'lucide-vue-next';
import { curriculumService } from '@/services/curriculumService';
import type { Unit } from '@/types/curriculum';

const route = useRoute();
const router = useRouter();
const unit = ref<Unit | undefined>(undefined);
const book = ref<Book | undefined>(undefined);

const notFound = ref(false);

onMounted(async () => {
    const unitId = String(route.params.unitId || '');
    const result = await curriculumService.getUnitById(unitId);

    if (!result) {
        notFound.value = true;
        return;
    }

    unit.value = result;
    book.value = await curriculumService.getBookById(result.bookId);
});

</script>

<template>
    <section class="space-y-6">
        <!-- Botón volver -->
        <BreadCrumbs v-if="unit && book" :items="[
            { label: 'Series', to: { name: 'books' } },
            { label: 'Libros', to: { name: 'series-detail', params: { seriesId: book.seriesId } } },
            { label: book.title, to: { name: 'book-units', params: { bookId: book.id } } },
            { label: `Unidad ${unit.number}` },
        ]" />

        <!-- Estado si no existe la unidad -->
        <div v-if="notFound" class="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p class="font-semibold text-slate-800">No encontramos esta unidad.</p>
            <p class="mt-1 text-sm text-slate-500">
                Verifica el enlace o selecciona otra unidad desde el menú de Libros.
            </p>
        </div>

        <!-- Contenido de la Unidad -->
        <template v-else-if="unit">
            <!-- Encabezado de Unidad -->
            <div class="rounded-2xl bg-[#2c3495] p-6 text-white">
                <span class="text-xs font-semibold uppercase tracking-wider text-blue-200">
                    Unidad {{ unit.number }}
                </span>
                <h1 class="mt-1 text-2xl font-bold">{{ unit.title }}</h1>
                <p class="mt-1 text-sm text-blue-100">{{ unit.topic }}</p>
            </div>

            <!-- Los 4 Pilares de Estudio -->
            <div class="grid gap-4 sm:grid-cols-2">
                <!-- 1. Vocabulario -->
                <div class="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5">
                    <div>
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2c3495]">
                            <Layers class="h-5 w-5" />
                        </div>
                        <h2 class="mt-3 font-bold text-slate-900">Vocabulario</h2>
                        <p class="mt-1 text-xs text-slate-500">
                            {{ unit.vocabulary.length }} palabras clave con pronunciación y ejemplos.
                        </p>
                    </div>
                    <button type="button" @click="router.push({ name: 'unit-flashcards', params: { unitId: unit.id } })"
                        class="mt-4 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-[#2c3495] hover:text-white">
                        Practicar Flashcards
                    </button>
                </div>

                <!-- 2. Gramática -->
                <div class="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5">
                    <div>
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2c3495]">
                            <BookText class="h-5 w-5" />
                        </div>
                        <h2 class="mt-3 font-bold text-slate-900">Gramática</h2>
                        <p class="mt-1 text-xs text-slate-500">
                            {{ unit.grammar.length }} tema(s) explicados con fórmula y consejos rápidos.
                        </p>
                    </div>
                    <button type="button"
                        class="mt-4 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-[#2c3495] hover:text-white">
                        Ver Explicación
                    </button>
                </div>

                <!-- 3. Reading Comprehension -->
                <div class="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5">
                    <div>
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2c3495]">
                            <FileText class="h-5 w-5" />
                        </div>
                        <h2 class="mt-3 font-bold text-slate-900">Reading Comprehension</h2>
                        <p class="mt-1 text-xs text-slate-500">
                            Lectura: "{{ unit.reading.title }}" ({{ unit.reading.questions.length }} preguntas).
                        </p>
                    </div>
                    <button type="button"
                        class="mt-4 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-[#2c3495] hover:text-white">
                        Leer y Responder
                    </button>
                </div>

                <!-- 4. Quiz de Unidad (CTA Principal en Rojo Naxxent) -->
                <div class="flex flex-col justify-between rounded-2xl border border-red-100 bg-white p-5">
                    <div>
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#f32c2b]">
                            <HelpCircle class="h-5 w-5" />
                        </div>
                        <h2 class="mt-3 font-bold text-slate-900">Quiz de la Unidad</h2>
                        <p class="mt-1 text-xs text-slate-500">
                            {{ unit.quiz.length }} preguntas con corrección inmediata.
                        </p>
                    </div>
                    <button type="button"
                        class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f32c2b] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                        <Play class="h-4 w-4 fill-current" />
                        <span>Iniciar Quiz</span>
                    </button>
                </div>
                <!-- 5. Listening de Unidad (CTA Principal en Rojo Naxxent) -->
                <div class="flex flex-col justify-between rounded-2xl border border-red-100 bg-white p-5">
                    <div>
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#f32c2b]">
                            <HelpCircle class="h-5 w-5" />
                        </div>
                        <h2 class="mt-3 font-bold text-slate-900">Listening</h2>
                        <p class="mt-1 text-xs text-slate-500">
                            {{ unit.listening.length }} preguntas con corrección inmediata.
                        </p>
                        <button type="button"
                            class="mt-4 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-[#2c3495] hover:text-white">
                            Leer y Responder
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </section>
</template>