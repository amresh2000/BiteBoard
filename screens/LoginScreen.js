import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState(true);

    const togglePasswordVisibility = () => {
        setPasswordVisibility(!passwordVisibility);
    };

    const storeTokenAndUserId = async (token, userId) => {
        try {
            await AsyncStorage.setItem('userToken', token);
        } catch (error) {
            console.log('Error saving the token or user ID', error);
        }
    };


    const { signIn } = useAuth(); // Destructure signIn from useAuth

    const handleLogin = async () => {
        try {
            const response = await fetch('http://10.0.2.2:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json(); // Attempt to parse JSON regardless of response status
            console.log("Response data:", data); // Log the response data for debugging

            if (response.status === 200) {
                await signIn(data);
            } else {
                // More detailed error message based on response status or data
                Alert.alert('Login Failed', data.message || `An error occurred with status code ${response.status}`);
            }
        } catch (error) {
            console.error('Login Error:', error); // Log the detailed error
            Alert.alert('Error', 'An error occurred during login. Please check the console for more details.');
        }
    };


    // const handleLogin = async () => {
    //     try {
    //         const response = await fetch('http://10.0.2.2:3000/api/users/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 email,
    //                 password,
    //             }),
    //         });

    //         const data = await response.json();
    //         if (response.status === 200) {
    //             await storeToken(data.token); // Assuming the token is returned as `data.token`
    //             console.log("Login successful, token stored:", data.token); // Logging the successful storage of token
    //             navigation.navigate('Home');
    //         } else {
    //             // Handle login failure
    //             Alert.alert('Login Failed', data.message || 'An error occurred');
    //         }
    //     } catch (error) {
    //         Alert.alert('Error', 'An error occurred during login');
    //     }
    // };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/bite-high-resolution-logo-black.png')} // Adjust the path as needed
                style={styles.logo}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={passwordVisibility}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Text>{passwordVisibility ? 'Show' : 'Hide'}</Text>
                </TouchableOpacity>
            </View>
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register New User" onPress={() => navigation.navigate('Register')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 100, // Set appropriate width
        height: 100, // Set appropriate height
        marginBottom: 20,
        alignSelf: 'center', // Centers the logo
    },
    input: {
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default LoginScreen;

