import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function DemoNavbarItem({ label, items, mobile, onClick }) {
  const dropdown = (
    <details
      className={clsx(styles.dropdown, !mobile && 'navbar__item dropdown')}
      onBlur={({ currentTarget, relatedTarget }) => {
        if (relatedTarget && !currentTarget.contains(relatedTarget)) currentTarget.open = false;
      }}
      onKeyDown={event => {
        if (event.key !== 'Escape' || !event.currentTarget.open) return;
        event.stopPropagation();
        event.currentTarget.open = false;
        event.currentTarget.querySelector('summary').focus();
      }}>
      <summary className={clsx(
        styles.toggle,
        mobile ? 'menu__link menu__link--sublist menu__link--sublist-caret' : 'navbar__link',
      )}>
        {label}
      </summary>
      <ul className={mobile ? 'menu__list' : 'dropdown__menu'}>
        {items.map(({ href, label: itemLabel, ...linkProps }) => (
          <li className={mobile ? 'menu__list-item' : undefined} key={href}>
            <a
              className={mobile ? 'menu__link' : 'dropdown__link'}
              href={href}
              {...linkProps}
              onClick={event => {
                event.currentTarget.closest('details').open = false;
                onClick?.(event);
              }}>
              {itemLabel}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );

  return mobile ? <li className="menu__list-item">{dropdown}</li> : dropdown;
}
