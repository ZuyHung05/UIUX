import { Image, StyleSheet } from 'react-native';

type SereneHeartLogoProps = {
  size?: number;
};

const logoSource = require('../../assets/serene_health_logo_blue_2.svg');

export function SereneHeartLogo({ size = 45 }: SereneHeartLogoProps) {
  return (
    <Image source={logoSource} style={[styles.logo, { width: size, height: size }]} />
  );
}

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'contain',
  },
});
