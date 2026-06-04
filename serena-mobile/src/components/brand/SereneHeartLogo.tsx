import { StyleSheet } from 'react-native';
import LogoSvg from '../../assets/serene_health_logo_blue_2.svg';
type SereneHeartLogoProps = {
  size?: number;
};
console.log(typeof LogoSvg);
console.log(LogoSvg);
// const logoSource = require('../../assets/serene_health_logo_blue_2.svg');

export function SereneHeartLogo({ size = 45 }: SereneHeartLogoProps) {
  return (
    <LogoSvg width={size} height={size} />
  );
}

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'contain',
  },
});
