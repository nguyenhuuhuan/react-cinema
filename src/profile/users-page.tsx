import { Chip, createTheme, TextField, ThemeProvider } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import * as React from 'react';
import { checked, OnClick, PageSizeSelect, SearchComponentState, useSearch, value } from 'react-hook-core';
import { useNavigate } from 'react-router';
import { Pagination } from 'reactx-pagination';
import { inputSearch } from 'uione';
import femaleIcon from '../assets/images/female.png';
import maleIcon from '../assets/images/male.png';
import { getUserService, User, UserFilter } from './user';
import { Skill } from './user/user';
interface UserSearch extends SearchComponentState<User, UserFilter> {
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#4db6ac'
    }
  }
});
const userFilter: UserFilter = {
  id: '',
  username: '',
  displayName: '',
  email: '',
  status: [],
  q: '',
  interests: [],
  // skills: [],
};
const initialState: UserSearch = {
  list: [],
  filter: userFilter,
};
export const UsersPage = () => {
  const navigate = useNavigate();
  const refForm = React.useRef();
  const [interests, setInterests] = React.useState<string[]>([]);
  // const [SkillTmpArray, setSkillTmpArray] = React.useState<Skill[]>([]);
  const getFilter = (): UserFilter => {
    return value(state.filter);
  };
  const p = { getFilter };
  const { state, resource, search, component, updateState, sort, clearQ, toggleFilter, changeView, pageChanged, pageSizeChanged, setState } = useSearch<User, UserFilter, UserSearch>(refForm, initialState, getUserService(), inputSearch(), p);
  component.viewable = true;
  component.editable = true;
  const edit = (e: OnClick, id: string) => {
    e.preventDefault();
    navigate(`${id}`);
  };

  const filter = value(state.filter);
  const { list } = state;

  return (
    <div className='view-container'>
      <header>
        <h2>{resource.users}</h2>
        <div className='btn-group'>
          {component.view !== 'table' && <button type='button' id='btnTable' name='btnTable' className='btn-table' data-view='table' onClick={changeView} />}
          {component.view === 'table' && <button type='button' id='btnListView' name='btnListView' className='btn-list-view' data-view='listview' onClick={changeView} />}
        </div>
      </header>
      <div>
        <form id='usersForm' name='usersForm' noValidate={true} ref={refForm as any}>
          <section className='row search-group'>
            <label className='col s12 m4 search-input'>
              <PageSizeSelect size={component.pageSize} sizes={component.pageSizes} onChange={pageSizeChanged} />
              <input type='text' id='q' name='q' value={filter.q || ''} onChange={updateState} maxLength={255} placeholder={resource.keyword} />
              <button type='button' hidden={!filter.q} className='btn-remove-text' onClick={clearQ} />
              <button type='button' className='btn-filter' onClick={toggleFilter} />
              <button type='submit' className='btn-search' onClick={search} />
            </label>
            <Pagination className='col s12 m8' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} />
          </section>
          <section className='row search-group inline' hidden={component.hideFilter}>
            <label className='col s12 m4 l4'>
              {resource.username}
              <input type='text'
                id='username' name='username'
                value={filter.username || ''}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.username} />
            </label>
            <label className='col s12 m4 l4'>
              {resource.display_name}
              <input type='text'
                id='displayName' name='displayName'
                value={filter.displayName || ''}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.display_name} />
            </label>
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
            <div className='col s12 m4 l4'>

              <Autocomplete
                options={[]}
                multiple
                id='tags-filled'
                freeSolo
                value={interests}
                onChange={(e, newValue: string[]) => {
                  if (newValue.length > -1) {
                    setInterests(newValue);
                    setState({ filter: { ...filter, interests: newValue } });
                  }
                }}
                renderTags={(v: readonly string[], getTagProps) =>
                  v.map((option: string, index: number) => (
                    <Chip variant='outlined' label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <ThemeProvider theme={theme}>
                    <TextField
                      {...params}
                      variant='standard'
                      name='interest'
                      color='primary'
                      // onChange={(e)=>setInterest(e.target.value)}
                      label={resource.interests}
                      placeholder={resource.interests}
                    // value={interest}
                    /></ThemeProvider>
                )}
              />

            </div>
            {/* <div className='col s12 m4 l4'>
              <Autocomplete
                options={[]}
                multiple
                id="tags-filled"
                freeSolo
                value={SkillTmpArray}
                onChange={(e, newValue: Skill[]) => {
                  if (newValue.length>-1) {
                    setSkillTmpArray(newValue);

                    setState({filter:{...filter,:newValue}})
                  }
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    name='skill'
                    label={resource.skills}
                    placeholder={resource.skills}
                  />
                )}
              />
            </div> */}
            {/* <label className='col s12 m4 l4'>
              {resource.skills}
              <div className='row'>
                <div className='inline-input'>
                  <input
                    type="text"
                    name='skill'
                    className="form-control"
                    value={skill}
                    onChange={updateState}
                    placeholder={resource.skills}
                    maxLength={50}
                  />
                  <button
                    type="button"
                    id="btnAddInterest"
                    name="btnAddInterest"
                    className="btn-add"
                    onClick={addSkill}
                  />
                </div>
                {filter.skills &&
                  filter.skills.map((item: Skill, index: number) => {
                    return (
                      <div key={index} className="chip" tabIndex={index}>
                        {item}
                        <button
                          type="button"
                          name="btnRemoveInterest"
                          className="close"
                          onClick={(e) => removeSkill(e, item)}
                        />
                      </div>
                    );
                  })}
              </div>
            </label> */}
          </section>
        </form>
        <form className='list-result'>
          {component.view === 'table' && <div className='table-responsive'>
            <table>
              <thead>
                <tr>
                  <th>{resource.sequence}</th>
                  <th data-field='userId'><button type='button' id='sortUserId' onClick={sort}>{resource.user_id}</button></th>
                  <th data-field='username'><button type='button' id='sortUserName' onClick={sort}>{resource.username}</button></th>
                  <th data-field='email'><button type='button' id='sortEmail' onClick={sort}>{resource.email}</button></th>
                  <th data-field='displayname'><button type='button' id='sortDisplayName' onClick={sort}>{resource.display_name}</button></th>
                  <th data-field='status'><button type='button' id='sortStatus' onClick={sort}>{resource.status}</button></th>
                </tr>
              </thead>
              {list && list.length > 0 && list.map((user, i) => {
                return (
                  <tr key={i} onClick={e => edit(e, user.userId)}>
                    <td className='text-right'>{(user as any).sequenceNo}</td>
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.displayName}</td>
                    <td>{user.status}</td>
                  </tr>
                );
              })}
            </table>
          </div>}
          {component.view !== 'table' && <ul className='row list-view'>
            {list && list.length > 0 && list.map((user, i) => {
              return (
                <li key={i} className='col s12 m6 l4 xl3' onClick={e => edit(e, user.id)}>
                  <section>
                    <img src={user.imageURL && user.imageURL.length > 0 ? user.imageURL : (user.gender === 'F' ? femaleIcon : maleIcon)} alt='user' className='round-border' />
                    <div>
                      <h3 className={user.status === 'I' ? 'inactive' : ''}>{user.displayName}</h3>
                      <p>{user.email}</p>
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

export function inArray(arr: string[], item: string): boolean {
  if (!arr || arr.length === 0) {
    return false;
  }
  const isExist = arr.filter((itemFilter) => itemFilter === item).length > 0;
  return isExist;
}
export function inSkill(arr: Skill[], item: Skill): boolean {
  if (!arr || arr.length === 0) {
    return false;
  }
  const isExist = arr.filter((itemFilter) => itemFilter === item).length > 0;
  return isExist;
}
