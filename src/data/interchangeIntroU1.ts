import type { Book, BookSeries, Unit } from '@/types/curriculum'
import InterchangeCoverImg from '@/assets/img/14.png'
import WorldlinkCoverImg from '@/assets/img/15.png'
import DoubleclickCoverImg from '@/assets/img/5.png'
import LevelIntroCoverImg from '@/assets/img/CoverIntroBookInterchange.jpg'
import CoverLevel1BookInterchange from '@/assets/img/CoverLevel1BookInterchange.jpg'
import CoverLevel2BookInterchange from '@/assets/img/CoverLevel2BookInterchange.jpg'
import CoverLevel3BookInterchange from '@/assets/img/CoverLevel3BookInterchange.jpg'
import CoverPassages1 from '@/assets/img/CoverPassages1.jpg'
import CoverPassages2 from '@/assets/img/CoverPassages2.jpg'
export const SERIES_DATA: BookSeries[] = [
  {
    id: 'interchange',
    title: 'Interchange',
    levelRange: 'Básico a Avanzado (A1 - C1)',
    description: 'Aprende inglés de forma natural con material comunicativo y efectivo.',
    booksCount: 6,
    status: 'active',
    accentTheme: 'blue',
    coverImage: InterchangeCoverImg,
  },
  {
    id: 'world-link',
    title: 'WorldLink',
    levelRange: 'Intermedio a Avanzado',
    description: 'Desarrolla habilidades comunicativas con contenido global y actual.',
    booksCount: 4,
    status: 'coming-soon',
    accentTheme: 'emerald',
    coverImage: WorldlinkCoverImg,
  },
  {
    id: 'double-click',
    title: 'DoubleClick',
    levelRange: 'Todos los niveles',
    description: 'Explora el mundo digital del inglés con tecnología educativa actual.',
    booksCount: 4,
    status: 'coming-soon',
    accentTheme: 'purple',
    coverImage: DoubleclickCoverImg,
  },
]

export const BOOKS_DATA: Book[] = [
  {
    id: 'interchange-intro',
    seriesId: 'interchange',
    title: 'Interchange Intro',
    subtitle: "Student's Book · 5th Ed",
    levelLabel: 'Intro',
    cefr: 'A1',
    totalUnits: 16,
    status: 'active',
    badge: '',
    // Cuando tengas la portada en public/images/interchange-intro.jpg, ponla aquí:
    coverImage: '',
    fallbackGradient: 'from-amber-400 via-yellow-400 to-orange-500',
  },
  {
    id: 'interchange-1',
    seriesId: 'interchange',
    title: 'Interchange Level 1',
    subtitle: "Student's Book · 5th Ed",
    levelLabel: '1',
    cefr: 'A2',
    totalUnits: 16,
    status: 'active',
    coverImage: '',
    fallbackGradient: 'from-rose-500 via-red-500 to-pink-600',
  },
  {
    id: 'interchange-2',
    seriesId: 'interchange',
    title: 'Interchange Level 2',
    subtitle: "Student's Book · 5th Ed",
    levelLabel: '2',
    cefr: 'B1',
    totalUnits: 16,
    status: 'coming-soon',
    coverImage: '',
    fallbackGradient: 'from-sky-500 via-blue-600 to-indigo-800',
  },
  {
    id: 'interchange-3',
    seriesId: 'interchange',
    title: 'Interchange Level 3',
    subtitle: "Student's Book · 5th Ed",
    levelLabel: '3',
    cefr: 'B1',
    totalUnits: 16,
    status: 'coming-soon',
    coverImage: '',
    fallbackGradient: 'from-lime-500 via-green-600 to-emerald-700',
  },
  {
    id: 'passages-1',
    seriesId: 'interchange',
    title: 'Passages 1',
    subtitle: "Student's Book · 3rd Ed",
    levelLabel: 'P1',
    cefr: 'B2',
    totalUnits: 12,
    status: 'coming-soon',
    coverImage: '',
    fallbackGradient: 'from-indigo-600 via-violet-600 to-purple-800',
  },
  {
    id: 'passages-2',
    seriesId: 'interchange',
    title: 'Passages 2',
    subtitle: "Student's Book · 3rd Ed",
    levelLabel: 'P2',
    cefr: 'C1',
    totalUnits: 12,
    status: 'coming-soon',
    coverImage: '',
    fallbackGradient: 'from-teal-500 via-cyan-600 to-slate-800',
  },
]

export const INTERCHANGE_INTRO_U1: Unit = {
  id: 'interchange-intro-u1',
  bookId: 'interchange-intro',
  number: 1,
  title: "It's nice to meet you.",
  topic: 'Greetings, introductions, and the verb To Be',
  vocabulary: [
    {
      id: 'v1',
      word: 'Classmates',
      translation: 'Compañeros de clase',
      phonetic: '/ˈklæs.meɪts/',
      partOfSpeech: 'noun',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
      exampleEn: 'They are my history **classmates**.',
      exampleEs: 'Ellos son mis compañeros de clase de historia.',
    },
    {
      id: 'v2',
      word: 'History',
      translation: 'Historia',
      phonetic: '/ˈhɪs.tə.ri/',
      partOfSpeech: 'noun',
      imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80',
      qa: {
        question: 'Is he in your **history** class?',
        answer: "Yes, **he's** my classmate.",
        questionEs: '¿Él está en tu clase de historia?',
        answerEs: 'Sí, él es mi compañero de clase.',
      },
    },
    {
      id: 'v3',
      word: 'First name',
      translation: 'Primer nombre',
      phonetic: '/fɜːrst neɪm/',
      partOfSpeech: 'noun',
      // Sin imageUrl: el diseño se centra automáticamente
      exampleEn: 'My **first name** is Carlos.',
      exampleEs: 'Mi primer nombre es Carlos.',
    },
  ],
  grammar: [
    {
      id: 'g1',
      title: 'Possessive Adjectives (My, Your, His, Her)',
      explanation:
        'Usamos los adjetivos posesivos antes de un sustantivo para indicar a quién pertenece algo o alguien.',
      formula: 'My / Your / His / Her + Noun',
      examples: [
        { en: 'My name is Maria.', es: 'Mi nombre es María.' },
        { en: 'His name is David.', es: 'Su nombre (de él) es David.' },
        { en: 'Her name is Sofia.', es: 'Su nombre (de ella) es Sofía.' },
      ],
      tip: 'No confundas "His" (de él) con "Her" (de ella). En español ambos se traducen como "su".',
    },
  ],
  reading: {
    id: 'r1',
    title: 'First Day at the Center',
    paragraphs: [
      'Hello! My name is Luis. I am a new student in the English Immersion Program. My class is in the morning, from 8:00 AM to 12:00 PM.',
      'My teacher is Ms. Johnson. She is very friendly. My classmate next to me is Laura. Her last name is Gomez, and she is from Santiago.',
    ],
    questions: [
      {
        id: 'rq1',
        prompt: 'What time is Luis’s class?',
        options: ['In the afternoon', 'In the morning', 'At night'],
        correctIndex: 1,
        explanation: 'El texto indica: "My class is in the morning, from 8:00 AM to 12:00 PM."',
      },
      {
        id: 'rq2',
        prompt: 'Where is Laura from?',
        options: ['Santo Domingo', 'La Vega', 'Santiago'],
        correctIndex: 2,
        explanation: 'Al final del segundo párrafo dice: "she is from Santiago."',
      },
    ],
  },
  quiz: [
    {
      id: 'q1',
      prompt: '___ name is Elena. She is my classmate.',
      options: ['His', 'Her', 'My', 'Your'],
      correctIndex: 1,
      explanation: 'Como hablamos de Elena ("She"), el posesivo correcto es "Her".',
    },
    {
      id: 'q2',
      prompt: 'A: "Nice to meet you." — B: "___"',
      options: ['I am fine.', 'Nice to meet you, too.', 'My name is Juan.', 'Good night.'],
      correctIndex: 1,
      explanation: '"Nice to meet you, too" es la respuesta natural a "Mucho gusto".',
    },
  ],
  listening: [
    {
      id: 'l1',
      title: 'Meeting New Classmates',
      paragraphs: [
        'Hi! My name is David. Nice to meet you.',
        'Hello David, I am Maria. Are you in the morning class?',
      ],
      questions: [
        {
          id: 'lq1',
          prompt: 'What is the man’s name?',
          options: ['Carlos', 'David', 'Luis'],
          correctIndex: 1,
          explanation: 'Al inicio del audio dice: "My name is David."',
        },
        {
          id: 'lq2',
          prompt: 'Who is he talking to?',
          options: ['Maria', 'Laura', 'Ana'],
          correctIndex: 0,
          explanation: 'Ella responde: "Hello David, I am Maria."',
        },
      ],

      
    },
    
  ],
videos: [
  {
    id: 'vid-1',
    title: 'Explicación: Verbo To Be y Saludos',
    description: 'Repaso rápido de am, is, are y cómo presentarte en clase.',
    category: 'grammar',
    youtubeId: 'EvXD8rIp1DQ',
    duration: '5:20',
  },
  {
    id: 'vid-2',
    title: 'Frases clave para el primer día',
    description: 'Pronunciación natural de las expresiones de la Unidad 1.',
    category: 'phrases',
    youtubeId: 'qFXbYKFIoDI',
    duration: '3:45',
  },
],
}
