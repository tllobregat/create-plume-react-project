import classNames from '@lib/class-names/ClassNames';
import React, { ReactNode } from 'react';
import scss from './actions.module.scss';

export type ActionButtonProps = {
  onClick?: () => void,
  isLoading?: boolean,
  cssClasses?: string,
  children?: ReactNode,
  disabled?: boolean,
};

export function ActionButton(
  {
    cssClasses,
    onClick,
    isLoading,
    children,
    disabled = false,
  }: ActionButtonProps,
) {
  return (
    <div className={classNames(scss.actionContainer, scss.loadingButton, cssClasses)}>
      <button
        data-testid="custom-button"
        onClick={onClick}
        type={onClick ? 'button' : 'submit'}
        disabled={isLoading || disabled}
      >
        {children}
      </button>
      {
        isLoading
        && (
          <div className={scss.loadingProgress}>
            Loading...
          </div>
        )
      }
    </div>
  );
}
