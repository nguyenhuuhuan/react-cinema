import { Attributes, Filter, Service, Tracking } from 'onecore';

export interface FilmFilter extends Filter {
  filmId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  status?: string[] | string;
}

export interface Film extends Tracking {
  filmId: string;
  title: string;
  status: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  categories?: string[];
}
export interface FilmSearch {
  list: Film[];
  total: number;
}
export interface FilmService extends Service<Film, string, FilmFilter> {
  getFilmsByCategoryId(id: string): Promise<FilmSearch>;
}

export const filmModel: Attributes = {
  filmId: {
    length: 40,
    key: true,
    required: true,
  },
  title: {
    length: 300,
    required: true,
  },
  description: {
    length: 300,
  },
  imageUrl: {
    length: 300
  },
  trailerUrl: {
    length: 300
  },
  categories: {
    type: 'primitives',
  },
  status: {
    match: 'equal',
    length: 1
  },
  createdBy: {
    length: 40

  },
  createdAt: {
    type: 'datetime'
  },
  updatedBy: {
    length: 40
  },
  updatedAt: {
    type: 'datetime'
  },
};
