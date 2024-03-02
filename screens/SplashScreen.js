import React, { useEffect } from 'react';
import { View, Text, Animated, Image } from 'react-native';

function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0); // Initial opacity value

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }
    ).start();

    // Wait for 3 seconds, then navigate to LoginScreen
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image source={require('../assets/bite-high-resolution-logo-black.png')} />
      </Animated.View>
    </View>
  );
}

export default SplashScreen;
