import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext'

type Props = {
    label?: string
    className?: string
    bgColor?: string
    textColor?: string
    handleClick: () => any
    disabled?: boolean
    svg?: string
    style?: React.CSSProperties
}

export default function Button({ label, handleClick, className, bgColor, textColor, disabled, svg, style }: Props) {
    const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>({ ...style })

    return svg ?
        <div
            className="button__icon"
            onClick={handleClick}
            style={{
                backgroundColor: bgColor || '#eeeeee',
                border: `1px solid ${bgColor || '#eeeeee'}`,
                color: textColor || 'black',
                opacity: disabled ? '.3' : '',
                padding: '.2vw',
                cursor: disabled ? 'not-allowed' : '',
                display: 'flex',
                flexDirection: 'row',
                minHeight: '2rem',
                alignItems: 'center',
                gap: '.5rem',
                paddingInline: '.5rem',
                ...buttonStyle
            }}
            onMouseEnter={() => setButtonStyle({
                ...style,
                backgroundColor: 'transparent',
                color: bgColor || 'black',
                border: `1px solid ${bgColor || 'lightgray'}`
            })}
            onMouseLeave={() => setButtonStyle({
                ...style,
                backgroundColor: bgColor || '#eeeeee',
                color: textColor || 'black',
            })}
        >
            <img src={svg} alt="Button" className='button__svg' />
            {label || ''}
        </div>
        :
        <button
            className={className || 'button__default'}
            onClick={handleClick}
            style={{
                backgroundColor: bgColor || '#eeeeee',
                border: `1px solid ${bgColor || '#eeeeee'}`,
                color: textColor || 'black',
                opacity: disabled ? '.3' : '',
                cursor: disabled ? 'not-allowed' : '',
                ...buttonStyle
            }}
            disabled={disabled}
            onMouseEnter={() => setButtonStyle({
                ...style,
                backgroundColor: 'transparent',
                color: bgColor || 'black',
                border: `1px solid ${bgColor || 'lightgray'}`
            })}
            onMouseLeave={() => setButtonStyle({
                ...style,
                backgroundColor: bgColor || '#eeeeee',
                color: textColor || 'black',
            })}
        >
            {label || ''}
        </button>
}