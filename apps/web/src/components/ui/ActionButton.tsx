import type { ReactNode } from 'react'
import './ActionButton.css'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

type PrimaryButtonProps = {
  children: ReactNode
  type?: 'button' | 'submit'
  variant?: ButtonVariant
  disabled?: boolean
  onClick?: () => void
}

type IconButtonProps = {
  label: string
  children: ReactNode
  variant?: ButtonVariant
  onClick?: () => void
}

export function PrimaryButton({
  children,
  type = 'button',
  variant = 'primary',
  disabled,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button className={`ui-button ui-button-${variant}`} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export function IconButton({ label, children, variant = 'secondary', onClick }: IconButtonProps) {
  return (
    <button className={`ui-icon-button ui-button-${variant}`} type="button" aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  )
}
