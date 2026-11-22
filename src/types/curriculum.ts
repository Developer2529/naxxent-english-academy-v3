export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export type ContentStatus = 'active' | 'coming-soon'
export type AccentTheme = 'blue' | 'emerald' | 'purple'

export interface BookSeries {
  id: string
  title: string
  levelRange: string
  description: string
  booksCount: number
  status: ContentStatus
  accentTheme: AccentTheme
  coverImage?: string
}

export interface Book {
  id: string
  seriesId: string
  title: string
  subtitle: string // Ej: "Student's Book"
  levelLabel: string // Ej: "Intro", "1", "2", "3"
  cefr: CefrLevel
  totalUnits: number
  status: ContentStatus
  badge?: string // Ej: "Beta"
  coverImage?: string // Tu imagen real en /public/images/...
  fallbackGradient: string // Degradado estilo portada si aún no subes la imagen
}

export interface VocabularyQA {
  question: string
  answer: string
  questionEs?: string
  answerEs?: string
}

export interface VocabularyItem {
  id: string
  word: string
  translation: string
  phonetic?: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'phrase'
  imageUrl?: string // Opcional: si no existe, el texto ocupa todo el ancho
  exampleEn?: string // Opcional: para tarjetas con oración simple
  exampleEs?: string
  qa?: VocabularyQA // Opcional: para tarjetas con Question & Answer
}

export interface GrammarExample {
  en: string
  es: string
}

export interface GrammarTopic {
  id: string
  title: string
  explanation: string
  formula?: string // Ej: "Subject + am/is/are + complement"
  examples: GrammarExample[]
  tip?: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number // Posición en el arreglo options (0, 1, 2, 3)
  explanation: string // Feedback inmediato si acierta o falla
}

export interface ReadingPassage {
  id: string
  title: string
  paragraphs: string[]
  questions: QuizQuestion[]
}

export interface ListeningPractice {
  id: string
  title: string
  paragraphs: string[]
  questions: QuizQuestion[]
}

export interface Unit {
  id: string
  bookId: string
  number: number
  title: string
  topic: string
  vocabulary: VocabularyItem[]
  grammar: GrammarTopic[]
  reading: ReadingPassage
  quiz: QuizQuestion[]
  listening: ListeningPractice[]
  videos?: UnitVideo[];
}

export type VideoCategory = 'grammar' | 'vocabulary' | 'phrases';

export interface UnitVideo {
  id: string;
  title: string;
  description?: string;
  category: VideoCategory;
  youtubeId: string; // Solo el código después de "v=" en la URL de YouTube
  duration?: string;
}

export interface ConversationLine {
  speaker: string;
  textEn: string;
  textEs: string;
}

export interface ConversationPractice {
  id: string;
  title: string;
  context: string;
  lines: ConversationLine[];
}