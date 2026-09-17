'use client'

import React, { useState, useRef, useEffect } from 'react'

interface HoverTooltipProps {
  text: string
  subtext?: string
  children?: React.ReactNode
  width?: number | string
  maxWidth?: number | string
  placement?: 'top' | 'bottom'
  align?: 'left' | 'center' | 'right'
  textStyle?: React.CSSProperties
  containerStyle?: React.CSSProperties
  className?: string
  showUnderline?: boolean
}

export default function HoverTooltip({
  text,
  subtext,
  children,
  width,
  maxWidth,
  placement = 'top',
  align = 'left',
  textStyle = {},
  containerStyle = {},
  className = '',
  showUnderline = false,
}: HoverTooltipProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [actualPlacement, setActualPlacement] = useState<'top' | 'bottom'>(placement)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isHovered && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      // If too close to viewport top (< 55px), flip to bottom
      if (placement === 'top' && rect.top < 55) {
        setActualPlacement('bottom')
      } else {
        setActualPlacement(placement)
      }
    }
  }, [isHovered, placement])

  // Horizontal alignment styles
  let alignStyle: React.CSSProperties = {}
  let arrowAlignStyle: React.CSSProperties = {}

  if (align === 'left') {
    alignStyle = { left: 0 }
    arrowAlignStyle = { left: 16 }
  } else if (align === 'right') {
    alignStyle = { right: 0 }
    arrowAlignStyle = { right: 16 }
  } else {
    // center
    alignStyle = { left: '50%', transform: 'translateX(-50%)' }
    arrowAlignStyle = { left: '50%', transform: 'translateX(-50%)' }
  }

  return (
    <div
      ref={containerRef}
      className={`hover-tooltip-container ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={text + (subtext ? ` (${subtext})` : '')}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: width || 'auto',
        maxWidth: maxWidth || '100%',
        minWidth: 0,
        cursor: 'default',
        ...containerStyle,
      }}
    >
      {/* Truncated base content */}
      {children ? (
        children
      ) : (
        <span
          style={{
            display: 'block',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textDecoration: isHovered && showUnderline ? 'underline dotted' : 'none',
            textUnderlineOffset: '3px',
            transition: 'color 0.15s ease',
            ...textStyle,
          }}
        >
          {text}
        </span>
      )}

      {/* Floating full-text tooltip */}
      {isHovered && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            ...(actualPlacement === 'top'
              ? { bottom: 'calc(100% + 7px)' }
              : { top: 'calc(100% + 7px)' }),
            ...alignStyle,
            zIndex: 9999,
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            padding: '7px 11px',
            borderRadius: 8,
            boxShadow: '0 10px 25px -3px rgba(15, 23, 42, 0.45), 0 4px 8px -2px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            fontSize: '0.72rem',
            lineHeight: 1.35,
            width: 'max-content',
            maxWidth: 280,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            pointerEvents: 'none',
            animation: 'fadeInTooltip 0.14s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              ...(actualPlacement === 'top'
                ? {
                    top: '100%',
                    borderTop: '5px solid #0f172a',
                  }
                : {
                    bottom: '100%',
                    borderBottom: '5px solid #1e293b',
                  }),
              ...arrowAlignStyle,
            }}
          />

          <div style={{ fontWeight: 700, color: '#f8fafc', letterSpacing: '0.01em' }}>
            {text}
          </div>
          {subtext && (
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 2, fontWeight: 500 }}>
              {subtext}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
