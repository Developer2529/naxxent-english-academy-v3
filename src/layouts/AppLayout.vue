<script setup lang="ts">
import { ref, computed, type Component } from 'vue';
import { useRoute } from 'vue-router';
import {
    Home,
    BookOpen,
    Dumbbell,
    Bookmark,
    User,
    Flame,
    LayoutGrid,
    Headphones,
    GraduationCap,
    X,
} from 'lucide-vue-next';

interface NavItem {
    name: string;
    label: string;
    to: string;
    icon: Component;
}

const route = useRoute();
const isMoreMenuOpen = ref(false);

// Máximo 4: siempre visibles en la barra inferior del celular
const primaryNavItems: NavItem[] = [
    { name: 'dashboard', label: 'Inicio', to: '/app', icon: Home },
    { name: 'books', label: 'Libros', to: '/app/libros', icon: BookOpen },
    { name: 'practice', label: 'Práctica', to: '/app/practica', icon: Dumbbell },
    { name: 'saved', label: 'Repaso', to: '/app/repaso', icon: Bookmark },
];

// Aquí puedes agregar 3, 5 o 10 módulos sin romper el celular
const extraNavItems: NavItem[] = [
    { name: 'call-center', label: 'Call Center', to: '/app/call-center', icon: Headphones },
    { name: 'courses', label: 'Cursos Privados', to: '/app/cursos', icon: GraduationCap },
    { name: 'profile', label: 'Perfil', to: '/app/perfil', icon: User },
];

const isActive = (path: string): boolean => {
    if (path === '/app') return route.path === '/app';
    return route.path.startsWith(path);
};

// Ilumina el botón "Más" si el usuario está dentro de alguna ruta secundaria
const isExtraActive = computed(() =>
    extraNavItems.some((item) => isActive(item.to)),
);
</script>

<template>
    <div class="min-h-screen bg-slate-50 text-slate-900">
        <!-- SIDEBAR: Solo visible en Tablet/Escritorio (md en adelante) -->
        <aside class="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
            <!-- Logo -->
            <div class="flex h-16 items-center gap-2 border-b border-slate-100 px-6">
                <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2c3495] font-bold text-white">
                    N
                </div>
                <div class="leading-tight">
                    <span class="block text-base font-bold text-[#2c3495]">Naxxent</span>
                    <span class="block text-xs font-medium text-slate-500">English Immersion Program</span>
                </div>
            </div>

            <!-- Enlaces de navegación -->
            <nav class="flex-1 space-y-1 overflow-y-auto p-4">
                <RouterLink v-for="item in primaryNavItems" :key="item.name" :to="item.to"
                    class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors" :class="isActive(item.to)
                        ? 'bg-[#2c3495]/10 text-[#2c3495]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        ">
                    <component :is="item.icon" class="h-5 w-5" />
                    <span>{{ item.label }}</span>
                </RouterLink>

                <!-- Separador de módulos extra -->
                <div class="pt-4 pb-1 px-4">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Más módulos
                    </span>
                </div>

                <RouterLink v-for="item in extraNavItems" :key="item.name" :to="item.to"
                    class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors" :class="isActive(item.to)
                        ? 'bg-[#2c3495]/10 text-[#2c3495]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        ">
                    <component :is="item.icon" class="h-5 w-5" />
                    <span>{{ item.label }}</span>
                </RouterLink>
            </nav>

            <!-- Tarjeta inferior de racha diaria -->
            <div class="border-t border-slate-100 p-4">
                <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <div class="flex items-center gap-2">
                        <Flame class="h-5 w-5 text-[#f32c2b]" />
                        <span class="text-sm font-semibold text-slate-700">Racha</span>
                    </div>
                    <span class="text-sm font-bold text-[#f32c2b]">0 días</span>
                </div>
            </div>
        </aside>

        <!-- TOP BAR: Solo visible en Móvil -->
        <header
            class="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden">
            <div class="flex items-center gap-2">
                <div
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2c3495] text-sm font-bold text-white">
                    N
                </div>
                <span class="font-bold text-[#2c3495]">Naxxent English Academy</span>
            </div>

            <div class="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1">
                <Flame class="h-4 w-4 text-[#f32c2b]" />
                <span class="text-xs font-bold text-[#f32c2b]">0</span>
            </div>
        </header>

        <!-- CONTENIDO PRINCIPAL -->
        <!-- md:pl-64 deja espacio al Sidebar en PC; pb-20 evita que el BottomNav tape contenido en móvil -->
        <main class="pb-20 md:pb-8 md:pl-64">
            <div class="mx-auto max-w-5xl p-4 md:p-8">
                <RouterView />
            </div>
        </main>

        <!-- BOTTOM SHEET (Menú "Más" para Móvil) -->
        <div v-if="isMoreMenuOpen"
            class="fixed inset-0 z-40 flex items-end bg-slate-900/40 backdrop-blur-[1px] md:hidden"
            @click.self="isMoreMenuOpen = false">
            <div class="w-full rounded-t-3xl bg-white p-5 pb-8 shadow-xl">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-base font-bold text-slate-900">Más opciones</h2>
                    <button type="button" @click="isMoreMenuOpen = false"
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                        aria-label="Cerrar menú">
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <RouterLink v-for="item in extraNavItems" :key="item.name" :to="item.to"
                        @click="isMoreMenuOpen = false"
                        class="flex items-center gap-3 rounded-2xl border p-3.5 text-sm font-semibold transition-colors"
                        :class="isActive(item.to)
                                ? 'border-[#2c3495] bg-[#2c3495]/5 text-[#2c3495]'
                                : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                            ">
                        <component :is="item.icon" class="h-5 w-5 shrink-0" />
                        <span class="truncate">{{ item.label }}</span>
                    </RouterLink>
                </div>
            </div>
        </div>

        <!-- BOTTOM NAVIGATION: Siempre 5 columnas exactas en Móvil -->
        <nav class="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white md:hidden"
            aria-label="Navegación principal">
            <div class="grid h-16 grid-cols-5">
                <RouterLink v-for="item in primaryNavItems" :key="item.name" :to="item.to"
                    @click="isMoreMenuOpen = false"
                    class="flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors"
                    :class="isActive(item.to) ? 'text-[#2c3495]' : 'text-slate-500'">
                    <component :is="item.icon" class="h-5 w-5"
                        :class="isActive(item.to) ? 'stroke-[2.5]' : 'stroke-[1.75]'" />
                    <span>{{ item.label }}</span>
                </RouterLink>

                <!-- 5to botón: Abre el Bottom Sheet -->
                <button type="button" @click="isMoreMenuOpen = !isMoreMenuOpen"
                    class="flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors"
                    :class="isMoreMenuOpen || isExtraActive ? 'text-[#2c3495]' : 'text-slate-500'">
                    <LayoutGrid class="h-5 w-5"
                        :class="isMoreMenuOpen || isExtraActive ? 'stroke-[2.5]' : 'stroke-[1.75]'" />
                    <span>Más</span>
                </button>
            </div>
        </nav>
    </div>
</template>