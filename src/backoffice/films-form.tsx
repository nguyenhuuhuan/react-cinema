import { ValueText } from 'onecore';
import * as React from 'react';
import { checked, OnClick, SearchComponentState, useSearch, value } from 'react-hook-core';
import PageSizeSelect from 'react-page-size-select';
import { useNavigate } from 'react-router-dom';
import Pagination from 'reactx-pagination';
import { inputSearch } from 'uione';
import { useFilm } from './service';
import { Film, FilmFilter } from './service/film';

interface FilmSearch extends SearchComponentState<Film, FilmFilter> {
    statusList: ValueText[];
}

const filmFilter: FilmFilter = {
    filmId: '',
    title: '',
    status: [],
    description: '',
    imageUrl: '',
    trailerUrl: '',
};

const initialState: FilmSearch = {
    statusList: [],
    list: [],
    filter: filmFilter
};

export const FilmsForm = () => {
    const refForm = React.useRef();
    const navigate = useNavigate();
    const { state, resource, component, changeView, updateState, search, sort, toggleFilter, pageChanged, pageSizeChanged }
        = useSearch<Film, FilmFilter, FilmSearch>(refForm, initialState, useFilm(), inputSearch());
    component.viewable = true;
    component.editable = true;

    const edit = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
        e.preventDefault();
        navigate(`edit/${id}`);
    };
    const add = (e:OnClick)=>{
      e.preventDefault();
      navigate('add');
    }
    const { list } = state;
    const filter = value(state.filter);
    return (
        <div className='view-container'>
            <header>
                <h2>{resource.films}</h2>
                <div className='btn-group'>
                    {component.view !== 'table' && <button type='button' id='btnTable' name='btnTable' className='btn-table' data-view='table' onClick={changeView} />}
                    {component.view === 'table' && <button type='button' id='btnListView' name='btnListView' className='btn-list-view' data-view='listview' onClick={changeView} />}
                    {component.addable && <button type='button' id='btnNew' name='btnNew' className='btn-new' onClick={add} />}

                </div>
            </header>
            <div>
                <form id='filmsForm' name='filmsForm' noValidate={true} ref={refForm as any}>
                    <section className='row search-group'>
                        <label className='col s12 m4 search-input'>
                            <PageSizeSelect size={component.pageSize} sizes={component.pageSizes} onChange={pageSizeChanged} />
                            <input type='text' id='q' name='q' value={filter.q} onChange={updateState} maxLength={255} placeholder={resource.keyword} />
                            <button type='button' className='btn-filter' onClick={toggleFilter} />
                            <button type='submit' className='btn-search' onClick={search} />
                        </label>
                        <Pagination className='col s12 m8' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} />
                    </section>
                    <section className='row search-group inline' hidden={component.hideFilter}>
                        <label className='col s12 m4 l4'>
                            {resource.title}
                            <input type='text'
                                id='title' name='title'
                                value={filter.title}
                                onChange={updateState}
                                maxLength={300}
                                placeholder={resource.title} />
                        </label>
                        {/* <label className='col s12 m4 l4'>
              {resource.display_name}
              <input type='text'
                id='displayName' name='displayName'
                value={filter.displayName}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.display_name} />
            </label> */}
                        <label className='col s12 m4 l4 checkbox-section'>
                            {resource.status}
                            <section className='checkbox-group'>
                                <label>
                                    <input
                                        type='checkbox'
                                        id='A'
                                        name='status'
                                        value='A'
                                        checked={checked(filter.status, 'A')}
                                        onChange={updateState} />
                                    {resource.active}
                                </label>
                                <label>
                                    <input
                                        type='checkbox'
                                        id='I'
                                        name='status'
                                        value='I'
                                        checked={checked(filter.status, 'I')}
                                        onChange={updateState} />
                                    {resource.inactive}
                                </label>
                            </section>
                        </label>
                    </section>
                </form>
                <form className='list-result'>
          {component.view === 'table' && <div className='table-responsive'>
            <table>
              <thead>
                <tr>
                  <th>{resource.sequence}</th>
                  <th data-field='filmId'><button type='button' id='sortFilmId' onClick={sort}>{resource.film_id}</button></th>
                  <th data-field='title'><button type='button' id='sortTitle' onClick={sort}>{resource.title}</button></th>
                  {/* <th data-field='email'><button type='button' id='sortEmail' onClick={sort}>{resource.email}</button></th>
                  <th data-field='displayname'><button type='button' id='sortDisplayName' onClick={sort}>{resource.display_name}</button></th> */}
                  <th data-field='status'><button type='button' id='sortStatus' onClick={sort}>{resource.status}</button></th>
                </tr>
              </thead>
              {list && list.length > 0 && list.map((film, i) => {
                return (
                  <tr key={i} onClick={e => edit(e, film.filmId)}>
                    <td className='text-right'>{(film as any).sequenceNo}</td>
                    <td>{film.filmId}</td>
                    <td>{film.title}</td>
                    <td>{film.status}</td>
                  </tr>
                );
              })}
            </table>
          </div>}
          {component.view !== 'table' && <ul className='row list-view'>
            {list && list.length > 0 && list.map((film, i) => {
              return (
                <li key={i} className='col s12 m6 l4 xl3' onClick={e => edit(e, film.filmId)}>
                  <section>
                    <img src={film.imageUrl && film.imageUrl.length > 0 ? film.imageUrl : ''} className='round-border' />
                    <div>
                      <h3 className={film.status === 'I' ? 'inactive' : ''}>{film.title}</h3>
                      {/* <p>{user.email}</p> */}
                    </div>
                    <button className='btn-detail' />
                  </section>
                </li>
              );
            })}
          </ul>}
        </form>
            </div>
        </div>
    );
};
