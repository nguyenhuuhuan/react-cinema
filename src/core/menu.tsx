import * as React from 'react';
import { Link } from 'react-router-dom';

export interface Props {
  id?: string;
  name?: string;
  className?: string;
  resource?: StringMap;
  iconClass?: string;
  path: string;
  toggle?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  expand?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  collapse?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  pin: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, m: Privilege) => void;
  pins: Privilege[];
  items: Privilege[];
}
export function Nav(p: Props) {
  return (
    <nav className={p.className}>
      <ul>
        <li>
          <button className='toggle-menu' onClick={p.toggle} />
          <p className='sidebar-off-menu'>
            <button className='toggle' onClick={p.toggle} />
            <i className='expand' onClick={p.expand} />
            <i className='collapse' onClick={p.collapse} />
          </p>
        </li>
        {renderItems(p.path, p.pins, p.pin, p.resource, p.iconClass, true, true)}
        {renderItems(p.path, p.items, p.pin, p.resource, p.iconClass, true)}
      </ul>
    </nav>
  );
}
export interface StringMap {
  [key: string]: string;
}
export interface Privilege {
  id?: string;
  name: string;
  resource?: string;
  path?: string;
  icon?: string;
  sequence?: number;
  children?: Privilege[];
}
export type Pin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, id: Privilege) => void;
export const renderItems = (activePath: string, features: Privilege[], pin: Pin, resource?: StringMap, iconClass?: string, pinable?: boolean, isPinned?: boolean) => {
  return features.map((feature, index) => {
    return renderItem(activePath, index, feature, pin, resource, iconClass, pinable, isPinned);
  });
};
export const renderItem = (activePath: string, key: number, module: Privilege, pin: Pin, resource?: StringMap, iconClass?: string, pinable?: boolean, isPinned?: boolean) => {
  let name = module.name;
  if (resource && module.resource) {
    name = !resource[module.resource] || resource[module.resource] === '' ? module.name : resource[module.resource];
  }
  const className = getIconClass(module.icon);
  if (module.children && Array.isArray(module.children)) {
    const link = module.path;
    const features = module.children;
    return (
      <li key={key} className={'open ' + activeWithPath(activePath, link, true, features)} /* onBlur={this.menuItemOnBlur} */>
        <div className='menu-item' onClick={(e) => toggleMenuItem(e)}>
        {pinable && <button type='button' className={`btn-pin ${isPinned ? 'pinned' : ''}`} onClick={(event) => pin(event, key, module)} />}
          <i className={iconClass}>{className}</i>
          <span>{name}</span>
          <i className='entity-icon down' />
        </div>
        <ul className='list-child expanded'>{renderItems(activePath, features, pin, resource, iconClass, false)}</ul>
      </li>
    );
  } else {
    return (
      <li key={key} className={activeWithPath(activePath, module.path, false)}>
        <Link to={module.path as any} className='menu-item'>
          {pinable && <button type='button' className={`btn-pin ${isPinned ? 'pinned' : ''}`} onClick={(event) => pin(event, key, module)} />}
          <i className={iconClass}>{className}</i>
          <span>{name}</span>
        </Link>
      </li>
    );
  }
};
export function findParent(ele: HTMLElement, node: string): HTMLElement|null {
  let current: HTMLElement|null = ele;
  while (true) {
    current = current.parentElement;
    if (!current) {
      return null;
    }
    if (current.nodeName === node) {
      return current;
    }
  }
}
export function getIconClass(icon?: string): string {
  return !icon || icon === '' ? 'settings' : icon;
}
export const onMouseHover = (e: { preventDefault: () => void; }, sysBody: HTMLElement) => {
  e.preventDefault();
  if (sysBody.classList.contains('top-menu') && window.innerWidth > 768) {
    const navbar = Array.from(document.querySelectorAll('.sidebar>nav>ul>li>ul.expanded'));
    const icons = Array.from(document.querySelectorAll('.sidebar>nav>ul>li>a>i.up'));
    if (navbar.length > 0) {
      for (let i = 0; i < navbar.length; i++) {
        navbar[i].classList.toggle('expanded');
        if (icons[i]) {
          icons[i].className = 'entity-icon down';
        }
      }
    }
  }
};
export const collapseAll = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  e.preventDefault();
  const parent = findParent(e.currentTarget, 'NAV');
  if (parent) {
    parent.classList.add('collapsed-all');
    parent.classList.remove('expanded-all');
    const navbar = Array.from(parent.querySelectorAll('.sidebar>nav>ul>li>ul.expanded'));
    if (navbar.length > 0) {
      const icons = Array.from(parent.querySelectorAll('.sidebar>nav>ul>li>a>i.up'));
      let i = 0;
      for (i = 0; i < navbar.length; i++) {
        navbar[i].className = 'list-child';
        if (icons[i]) {
          icons[i].className = 'entity-icon down';
        }
      }
    }
  }
};
export const expandAll = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  e.preventDefault();
  const parent = findParent(e.currentTarget, 'NAV');
  if (parent) {
    parent.classList.remove('collapsed-all');
    parent.classList.add('expanded-all');
    const navbar = Array.from(parent.querySelectorAll('.sidebar>nav>ul>li>ul.list-child'));
    if (navbar.length > 0) {
      const icons = Array.from(parent.querySelectorAll('.sidebar>nav>ul>li>a>i.down'));
      let i = 0;
      for (i = 0; i < navbar.length; i++) {
        navbar[i].className = 'list-child expanded';
        if (icons[i]) {
          icons[i].className = 'entity-icon up';
        }
      }
    }
  }
};
export function isCollapsedAll(parent: HTMLElement): boolean {
  const navbar = Array.from(parent.querySelectorAll('.sidebar>nav>ul>li>ul.list-child'));
  if (navbar.length > 0) {
    let i = 0;
    for (i = 0; i < navbar.length; i++) {
      if (navbar[i].classList.contains('expanded')) {
        return false;
      }
    }
    return true;
  }
  return false;
}
export function isExpandedAll(parent: HTMLElement): boolean {
  const navbar = Array.from(parent.querySelectorAll('.sidebar>nav>ul>li>ul.list-child'));
  if (navbar.length > 0) {
    let i = 0;
    for (i = 0; i < navbar.length; i++) {
      if (!navbar[i].classList.contains('expanded')) {
        return false;
      }
    }
    return true;
  }
  return false;
}
export const activeWithPath = (activePath: string, path: string | undefined, isParent: boolean, features?: Privilege[]) => {
  if (isParent && features && Array.isArray(features)) {
    const hasChildLink = features.some((item) => item.path && item.path.length > 0 && activePath.startsWith(item.path));
    return path && activePath.startsWith(path) && hasChildLink ? 'active' : '';
  }
  return path && activePath.startsWith(path) ? 'active' : '';
};
export const toggleMenuItem = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
  event.preventDefault();
  let target: HTMLElement|null = event.currentTarget;
  const currentTarget = event.currentTarget;
  const elI = currentTarget.querySelectorAll('.menu-item > i')[1];
  if (elI) {
    if (elI.classList.contains('down')) {
      elI.classList.remove('down');
      elI.classList.add('up');
    } else {
      if (elI.classList.contains('up')) {
        elI.classList.remove('up');
        elI.classList.add('down');
      }
    }
  }
  if (currentTarget.nextElementSibling) {
    currentTarget.nextElementSibling.classList.toggle('expanded');
  }
  if (target.nodeName === 'A') {
    target = target.parentElement;
  }
  if (target && target.nodeName === 'LI') {
    target.classList.toggle('open');
  }
  const parent = findParent(currentTarget, 'NAV');
  if (parent) {
    setTimeout(() => {
      if (isExpandedAll(parent)) {
        parent.classList.remove('collapsed-all');
        parent.classList.add('expanded-all');
      } else if (isCollapsedAll(parent)) {
        parent.classList.remove('expanded-all');
        parent.classList.add('collapsed-all');
      } else {
        parent.classList.remove('expanded-all');
        parent.classList.remove('collapsed-all');
      }
    }, 0);
  }
};
