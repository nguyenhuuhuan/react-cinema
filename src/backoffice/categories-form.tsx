import { ValueText } from 'onecore';
import * as React from 'react';
import { checked, OnClick, PageSizeSelect, SearchComponentState, useSearch, value } from 'react-hook-core';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'reactx-pagination';
import { inputSearch } from 'uione';
import { useCategory } from './service';
import { Category, CategoryFilter } from './service/category';

interface CategorySearch extends SearchComponentState<Category, CategoryFilter> {
  statusList: ValueText[];
}
const categoryFilter: CategoryFilter = {
  categoryId: '',
  categoryName: '',
  status: ''
};
const categorySearch: CategorySearch = {
  statusList: [],
  list: [],
  filter: categoryFilter
};
export const CategoriesForm = () => {
  const navigate = useNavigate();
  const refForm = React.useRef();
  const { state, resource, component, updateState, search, sort, toggleFilter, changeView, pageChanged, pageSizeChanged }
    = useSearch<Category, CategoryFilter, CategorySearch>(refForm, categorySearch, useCategory(), inputSearch());
  component.viewable = true;
  component.editable = true;

  const edit = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    e.preventDefault();
    navigate(`edit/${id}`);
  };
  const add = (e: OnClick) => {
    e.preventDefault();
    navigate(`add`);
  };
  const filter = value(state.filter);
  return (
    <div className='view-container'>
      <header>
        <h2>{resource.category_list}</h2>
        <div className='btn-group'>
          {component.view !== 'table' && <button type='button' id='btnTable' name='btnTable' className='btn-table' data-view='table' onClick={changeView} />}
          {component.view === 'table' && <button type='button' id='btnListView' name='btnListView' className='btn-list-view' data-view='listview' onClick={changeView} />}
          {component.addable && <button type='button' id='btnNew' name='btnNew' className='btn-new' onClick={add} />}
        </div>
      </header>
      <div>
        <form id='categoriesForm' name='categoriesForm' noValidate={true} ref={refForm as any}>
          <section className='row search-group'>
            <label className='col s12 m6 search-input'>
              <PageSizeSelect size={component.pageSize} sizes={component.pageSizes} onChange={pageSizeChanged} />
              <input type='text' id='q' name='q' value={filter.q} onChange={updateState} maxLength={255} placeholder={resource.keyword} />
              <button type='button' className='btn-filter' onClick={toggleFilter} />
              <button type='submit' className='btn-search' onClick={search} />
            </label>
            <Pagination className='col s12 m6' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} />
          </section>
          <section className='row search-group inline' hidden={component.hideFilter}>
            <label className='col s12 m6'>
              {resource.category_name}
              <input
                type='text'
                id='categoryName'
                name='categoryName'
                value={filter.categoryName}
                onChange={updateState}
                maxLength={240}
                placeholder={resource.category_name} />
            </label>
            <label className='col s12 m6'>
              {resource.status}
              <section className='checkbox-group'>
                <label>
                  <input
                    type='checkbox'
                    id='active'
                    name='status'
                    value='A'
                    checked={checked(filter.status, 'A')}
                    onChange={updateState} />
                  {resource.active}
                </label>
                <label>
                  <input
                    type='checkbox'
                    id='inactive'
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
                  <th data-field='categoryId'><button type='button' id='sortC ategoryId' onClick={sort}>{resource.category_id}</button></th>
                  <th data-field='categoryName'><button type='button' id='sortCategoryName' onClick={sort}>{resource.category_name}</button></th>
                  {/* <th data-field='remark'><button type='button' id='sortRemark' onClick={sort}>{resource.remark}</button></th> */}
                  <th data-field='status'><button type='button' id='sortStatus' onClick={sort}>{resource.status}</button></th>
                </tr>
              </thead>
              {state.list && state.list.length > 0 && state.list.map((item, i) => {
                return (
                  <tr key={i} onClick={e => edit(e, item.categoryId)}>
                    <td className='text-right'>{(item as any).sequenceNo}</td>
                    <td>{item.categoryId}</td>
                    <td>{item.categoryName}</td>
                    {/* <td>{item.remark}</td> */}
                    <td>{item.status}</td>
                  </tr>
                );
              })}
            </table>
          </div>}
          {component.view !== 'table' && <ul className='row list-view'>
            {state.list && state.list.length > 0 && state.list.map((item, i) => {
              return (
                <li key={i} className='col s12 m6 l4 xl3' onClick={e => edit(e, item.categoryId)}>
                  <section>
                    <div>
                      <h3>{item.categoryName}</h3>
                      <p>{item.categoryName}</p>
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
