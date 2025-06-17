import  { type PointerEventHandler, type ReactElement } from 'react';
import classNames from "classnames";

import './Button.scss';

export type ButtonColorType  = "primary" | "danger" | 'default';

export interface ButtonProps {
    text?: string | ReactElement,
    color?: ButtonColorType,
    classes?: string,
    onClick?: PointerEventHandler | null,
}

const cssClasses = {
    BUTTON_BASE: 'button',
};


export const Button = ((props: ButtonProps) => {
    const {
        text,
        color = 'primary',
        onClick,
        classes,
    } = props;

    const cssButtonBase = `${cssClasses.BUTTON_BASE}-${color}`;

    const handleClick: PointerEventHandler<HTMLButtonElement> = (event) => {
        if (onClick) {
            onClick(event);
        }
    };

    const buttonClasses = classNames(
        cssClasses.BUTTON_BASE,
        cssButtonBase,
        classes,
    );

    return (
            <button
                className={buttonClasses}
                onClick={handleClick}
            >
                {text && <span>{text}</span>}
            </button>
    );
});
