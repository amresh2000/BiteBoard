import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const Stack = createStackNavigator();

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

export default AuthStack;
