import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import {
  Film,
  FilmFilter,
  filmModel,
  FilmSearch,
  FilmService,
} from './film';

export * from './film';

export class FilmClient extends Client<Film, string, FilmFilter> implements FilmService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, filmModel);
    this.searchGet = true;
    this.getFilmsByCategoryId = this.getFilmsByCategoryId.bind(this);

  }
  getFilmsByCategoryId(id: string): Promise<FilmSearch> {
    const url = `${this.serviceUrl}/search?categories[]={${id}}`;
    return this.http.get<FilmSearch>(url);
  }
}
