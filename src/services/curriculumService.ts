import { BOOKS_DATA, INTERCHANGE_INTRO_U1, SERIES_DATA } from '@/data/interchangeIntroU1'
import type { Book, BookSeries, Unit } from '@/types/curriculum'

const UNITS_MAP: Record<string, Unit> = {
  [INTERCHANGE_INTRO_U1.id]: INTERCHANGE_INTRO_U1,
}

export const curriculumService = {
  async getSeries(): Promise<BookSeries[]> {
    return SERIES_DATA
  },

  async getSeriesById(seriesId: string): Promise<BookSeries | undefined> {
    return SERIES_DATA.find((s) => s.id === seriesId)
  },

  async getBooksBySeries(seriesId: string): Promise<Book[]> {
    return BOOKS_DATA.filter((book) => book.seriesId === seriesId)
  },

  async getUnitsByBook(bookId: string): Promise<Unit[]> {
    return Object.values(UNITS_MAP).filter((unit) => unit.bookId === bookId)
  },

  async getUnitById(unitId: string): Promise<Unit | undefined> {
    return UNITS_MAP[unitId]
  },

  async getBookById(bookId: string): Promise<Book | undefined> {
    return BOOKS_DATA.find((book) => book.id === bookId)
  },
}
