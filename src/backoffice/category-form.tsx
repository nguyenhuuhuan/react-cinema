import * as React from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit, useEditProps } from 'react-hook-core';
import { useNavigate } from 'react-router-dom';
import { handleError, inputEdit, Status } from 'uione';
import { useCategory } from './service';
import { Category } from './service/category/index';

const initialState: InternalState = {
    category: {} as Category
};
interface InternalState {
    category: Category;
}

const createCategory = (): Category => {
    const category = createModel<Category>();
    category.status = Status.Active;
    return category;
};
const initialize = async (categoryId: string | null, load: (id: string | null) => void, set: DispatchWithCallback<Partial<InternalState>>) => {
    load(categoryId);
};
const param: EditComponentParam<Category, string, InternalState> = {
    createModel: createCategory,
    initialize
};

export function CategoryForm() {
    const refForm = React.useRef();
    const navigate = useNavigate();
    const { resource, state, setState, back, flag, updateState, save }
        = useEdit<Category, string, InternalState>(refForm, initialState, useCategory(), inputEdit(), param);
    // const assign = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    //     e.preventDefault();
    //     navigate(`/categories/assign/${id}`);
    //     return;
    // };
    return (
        <div className='view-container'>
            <form id='categoryForm' name='categoryForm' model-name='category' ref={refForm as any}>
                <header>
                    <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
                    <h2>{flag.newMode ? resource.create : resource.edit} category</h2>
                    {/* <i onClick={e => assign(e, state.category.categoryId)} className='btn material-icons'>group</i> */}

                </header>
                <div>
                    <section className='row'>
                        <label className='col s12 m6'>
                            {resource.category_id}
                            <input type='text'
                                id='categoryId' name='categoryId'
                                value={state.category.categoryId}
                                onChange={updateState}
                                maxLength={20} required={true}
                                readOnly={!flag.newMode}
                                placeholder={resource.category_id} />
                        </label>
                        <label className='col s12 m6'>
                            {resource.category_name}
                            <input type='text'
                                id='categoryName' name='categoryName'
                                value={state.category.categoryName}
                                onChange={updateState}
                                maxLength={255}
                                required={true}
                                placeholder={resource.category_name} />
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
                                        value='A' checked={state.category.status === 'A'} />
                                    {resource.active}
                                </label>
                                <label>
                                    <input
                                        type='radio'
                                        id='inactive'
                                        name='status'
                                        onChange={(e) => updateState(e, () => setState)}
                                        value='I' checked={state.category.status === 'I'} />
                                    {resource.inactive}
                                </label>
                            </div>
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
}

// import * as React from 'react';
// import { createModel, DispatchWithCallback, EditComponentParam, useEditProps } from 'react-hook-core';
// import { RouteComponentProps } from 'react-router';
// import { useHistory } from 'react-router-dom';
// import { handleError, inputEdit, Status } from 'uione';
// import { Privilege, Role, useRole } from './service';

// interface InternalState {
//     role: Role;
//     allPrivileges: Privilege[];
//     shownPrivileges: Privilege[];
//     checkedAll?: boolean;
//     keyword: string;
//     all: string[];
// }
// const initialState: InternalState = {
//     role: {} as Role,
//     allPrivileges: [],
//     shownPrivileges: [],
//     keyword: '',
//     checkedAll: false,
//     all: [],
// };
// const createRole = (): Role => {
//     const user = createModel<Role>();
//     user.status = Status.Active;
//     return user;
// };


// function buildAll(privileges: string[], all: Privilege[]): void {
//     for (const root of all) {
//         privileges.push(root.id);
//         if (root.children && root.children.length > 0) {
//             buildAll(privileges, root.children);
//         }
//     }
// }

// const initialize = async (roleId: string | null, load: (id: string | null) => void, set: DispatchWithCallback<Partial<InternalState>>) => {
//     const roleService = useRole();
//     roleService.getPrivileges().then(allPrivileges => {
//         const all: string[] = [];
//         buildAll(all, allPrivileges);
//         set({ all, allPrivileges, shownPrivileges: allPrivileges }, () => load(roleId));
//     }).catch(handleError);
// };
// const param: EditComponentParam<Role, string, InternalState> = {
//     createModel: createRole,
//     initialize
// };
// export function CategoryForm(props: RouteComponentProps) {
//     const refForm = React.useRef();
//     const history = useHistory();
//     const { state, setState, back, flag, updateState, save, resource } = useEditProps<Role, string, InternalState, RouteComponentProps>(props, refForm, initialState, useRole(), inputEdit(), param);
//     //   React.useEffect(() => {
//     //     showModel(state.role);
//     //   }, [state.role]);
//     //   function showModel(role: Role) {
//     //     if (!role) {
//     //       return;
//     //     }
//     //     const { all } = state;
//     //     if (!role.privileges) {
//     //       role.privileges = [];
//     //     } else {
//     //       role.privileges = role.privileges.map(p => p.split(' ', 1)[0]);
//     //     }
//     //     setState({ role }, () => isCheckedAll(role.privileges, all, setState));
//     //   }
//     //   const handleCheckAll = (event: any) => {
//     //     const { role, all } = state;
//     //     event.persist();
//     //     const checkedAll = event.target.checked;
//     //     role.privileges = (checkedAll ? all : []);
//     //     setState({ role, checkedAll });
//     //   };
//     //   const handleCheck = (event: any) => {
//     //     const { role, all, allPrivileges } = state;
//     //     event.persist();
//     //     const target = event.target;
//     //     const id = target.getAttribute('data-id');
//     //     const type = target.getAttribute('data-type');
//     //     role.privileges = buildPrivileges(id, type, role.privileges ? role.privileges : [], allPrivileges);
//     //     setState({ role }, () => isCheckedAll(role.privileges, all, setState));
//     //   };
//     //   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     //     const q = e.target.value;
//     //     const { allPrivileges } = state;
//     //     const shownPrivileges = buildShownModules(q, allPrivileges);
//     //     setState({ keyword: q, shownPrivileges });
//     //   };
//     // const assign = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
//     //     e.preventDefault();
//     //     history.push(`/roles/assign/${id}`);
//     //     return;
//     // };

//     //   const renderForms = (roles: Role, modules: Privilege[]|undefined, parentId: string, disableds: boolean, allPrivilege: Privilege[]) => {
//     //     if (!modules || modules.length === 0) {
//     //       return '';
//     //     }
//     //     return modules.map(m => renderForm(roles, m, parentId, disableds, allPrivilege));
//     //   };

//     //   const renderForm = (roles: Role, m: Privilege, parentId: string, disableds: boolean, allPrivilege: Privilege[]) => {
//     //     if (m.children && m.children.length > 0) {
//     //       const checked = containOne(roles.privileges, m.children);
//     //       return (
//     //         <section className='col s12' key={m.id}>
//     //           <label className='checkbox-container'>
//     //             <input
//     //               type='checkbox'
//     //               name='modules'
//     //               disabled={disableds}
//     //               data-id={m.id}
//     //               data-type='parent'
//     //               checked={checked}
//     //               onChange={handleCheck} />
//     //             {m.name}
//     //           </label>
//     //           <section className='row checkbox-group'>
//     //             {renderForms(roles, m.children, m.id, disableds, allPrivilege)}
//     //           </section>
//     //           <hr />
//     //         </section>
//     //       );
//     //     } else {
//     //       return (
//     //         <section className='col s12 m4 l3' key={m.id}>
//     //           <label className='checkbox-container'>
//     //             <input
//     //               type='checkbox'
//     //               name='modules'
//     //               data-id={m.id}
//     //               data-parent={parentId}
//     //               checked={roles.privileges ? (roles.privileges.find(item => item === m.id) ? true : false) : false}
//     //               onChange={handleCheck}
//     //             />
//     //             {m.name}
//     //           </label>
//     //         </section>
//     //       );
//     //     }
//     //   };
//     return (
//         <div className='view-container'>
//             <form id='roleForm' name='roleForm' model-name='role' ref={refForm as any}>
//                 <header>
//                     <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
//                     <h2>{flag.newMode ? resource.create : resource.edit} {resource.role}</h2>
//                     {/* <i onClick={e => assign(e, state.role.roleId)} className='btn material-icons'>group</i> */}
//                 </header>
//                 {/* <div>
//           <section className='row'>
//             <label className='col s12 m6'>
//               {resource.role_id}
//               <input type='text'
//                 id='roleId' name='roleId'
//                 value={state.role.roleId}
//                 onChange={updateState}
//                 maxLength={20} required={true}
//                 readOnly={!flag.newMode}
//                 placeholder={resource.role_id} />
//             </label>
//             <label className='col s12 m6'>
//               {resource.role_name}
//               <input type='text'
//                 id='roleName' name='roleName'
//                 value={state.role.roleName}
//                 onChange={updateState}
//                 maxLength={255}
//                 placeholder={resource.role_name} />
//             </label>
//             <label className='col s12 m6'>
//               {resource.remark}
//               <input type='text'
//                 id='remark' name='remark'
//                 value={state.role.remark}
//                 onChange={updateState}
//                 maxLength={255}
//                 placeholder={resource.remark} />
//             </label>
//             <div className='col s12 m6 radio-section'>
//               {resource.status}
//               <div className='radio-group'>
//                 <label>
//                   <input
//                     type='radio'
//                     id='active'
//                     name='status'
//                     onChange={(e) => updateState(e, () => setState)}
//                     value='A' checked={state.role.status === 'A'} />
//                   {resource.active}
//                 </label>
//                 <label>
//                   <input
//                     type='radio'
//                     id='inactive'
//                     name='status'
//                     onChange={(e) => updateState(e, () => setState)}
//                     value='I' checked={state.role.status === 'I'} />
//                   {resource.inactive}
//                 </label>
//               </div>
//             </div>
//           </section>
//           <h4>
//             <label>
//               <input
//                 type='checkbox'
//                 value='all'
//                 disabled={state.keyword !== ''}
//                 data-type='all'
//                 checked={state.checkedAll}
//                 onChange={handleCheckAll} />
//               {resource.all_privileges}
//             </label>
//             <label className='col s12 search-input'>
//               <i className='btn-search' />
//               <input type='text'
//                 id='keyword'
//                 name='keyword'
//                 maxLength={40}
//                 placeholder={resource.role_filter_modules}
//                 value={state.keyword}
//                 onChange={onChange} />
//             </label>
//           </h4>
//           <section className='row hr-height-1'>
//             {
//               renderForms(state.role, state.shownPrivileges, '', state.keyword !== '', state.allPrivileges)}
//           </section>
//         </div>
//         <footer>
//           {!flag.readOnly &&
//             <button type='submit' id='btnSave' name='btnSave' onClick={save}>
//               {resource.save}
//             </button>}
//         </footer> */}
//             </form>
//         </div>
//     );
// }
