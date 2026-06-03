import sereneHealthLogo from '../../assets/icons/serene_health_logo_blue_2.svg'

type SystemLogoProps = {
  className?: string
}

export function SystemLogo({ className = 'system-logo' }: SystemLogoProps) {
  return (
    <img
      className={className}
      src={sereneHealthLogo}
      alt="Serene Health"
    />
  )
}
