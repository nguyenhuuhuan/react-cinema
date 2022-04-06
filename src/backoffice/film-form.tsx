import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import * as React from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from 'react-hook-core';
import { inputEdit, inputSearch, Status } from 'uione';
import { useCategory, useFilm } from './service';
import { Category } from './service/category';
import { Film } from './service/film';

interface InternalState {
    film: Film;
    categoryList: string[];
    showAutocomplete: boolean;
}
const initialState: InternalState = {
    film: {} as Film,
    categoryList: [],
    showAutocomplete: false
};


const createFilm = (): Film => {
    const film = createModel<Film>();
    film.categories = [];
    film.status = Status.Active;
    return film;
};

const initialize = async (filmId: string | null, load: (id: string | null) => void, set: DispatchWithCallback<Partial<InternalState>>) => {
    const categoryService = useCategory();
    categoryService.getAllCategories().then(allCategories => {
        const categoryList: string[] = [];
        for (const item of allCategories) {
            categoryList.push(item.categoryName);
        }
        load(filmId);
        set({ categoryList, showAutocomplete: true });
    });
};

const param: EditComponentParam<Film, string, InternalState> = {
    createModel: createFilm,
    initialize
};
export const FilmForm = () => {
    const refForm = React.useRef();
    const { resource, state, setState, back, flag, updateState, save }
        = useEdit<Film, string, InternalState>( refForm, initialState, useFilm(), inputEdit(), param);
    return (
        <div className='view-container'>
            <form id='filmForm' name='filmForm' model-name='film' ref={refForm as any}>
                <header>
                    <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
                    <h2>{flag.newMode ? resource.create : resource.edit} film</h2>

                </header>
                <div>
                    <section className='row'>
                        <label className='col s12 m6'>
                            {resource.film_id}
                            <input type='text'
                                id='filmId' name='filmId'
                                value={state.film.filmId}
                                onChange={updateState}
                                maxLength={20} required={true}
                                readOnly={!flag.newMode}
                                placeholder={resource.film_id} />
                        </label>
                        <label className='col s12 m6'>
                            {resource.title}
                            <input type='text'
                                id='title' name='title'
                                value={state.film.title}
                                onChange={updateState}
                                maxLength={300}
                                required={true}
                                placeholder={resource.title} />
                        </label>
                        <label className='col s12 m6'>
                            {resource.image_url}
                            <input
                                type='text'
                                id='imageUrl'
                                name='imageUrl'
                                value={state.film.imageUrl}
                                onChange={updateState}
                                maxLength={300}
                                placeholder={resource.image_url} />
                        </label>
                        <label className='col s12 m6'>
                            {resource.trailer_url}
                            <input
                                type='text'
                                id='trailerUrl'
                                name='trailerUrl'
                                value={state.film.trailerUrl}
                                onChange={updateState}
                                maxLength={300}
                                placeholder={resource.trailer_url} />
                        </label>
                        <label className='col s12 m6'>
                            {resource.description}
                            <input
                                type='text'
                                id='description'
                                name='description'
                                value={state.film.description}
                                onChange={updateState}
                                maxLength={300}
                                placeholder={resource.description} />
                        </label>
                        <div className='col s12 m6 radio-section'>
                            {resource.status}
                            <div className='radio-group'>
                                <label>
                                    <input
                                        type='radio'
                                        id='active'
                                        name='status'
                                        onChange={(e) => updateState(e, () => setState)}
                                        value='A' checked={state.film.status === 'A'} />
                                    {resource.active}
                                </label>
                                <label>
                                    <input
                                        type='radio'
                                        id='inactive'
                                        name='status'
                                        onChange={(e) => updateState(e, () => setState)}
                                        value='I' checked={state.film.status === 'I'} />
                                    {resource.inactive}
                                </label>
                            </div>
                        </div>
                        <div className='col s12 m6'>
                            {((!flag.newMode && state.film.categories) || flag.newMode) && <Autocomplete
                                multiple={true}
                                options={state.categoryList}
                                value={state.film.categories}
                                onChange={(e, newValue) => {
                                    console.log(newValue);

                                    const newFilm = { ...state.film, categories: newValue };
                                    setState({ film: newFilm }, () => {
                                        console.log(newFilm);
                                    });
                                }
                                }
                                filterSelectedOptions={true}
                                renderInput={(params) => (
                                    <TextField {...params} variant='outlined' label='categories' placeholder='category' />
                                )}
                            />}
                        </div>
                    </section>
                </div>
                <footer>
                    {!flag.readOnly &&
                        <button type='submit' id='btnSave' name='btnSave' onClick={save}>
                            {resource.save}
                        </button>}
                </footer>
            </form>
        </div>
    );
};
