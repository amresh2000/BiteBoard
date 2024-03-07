import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check the AsyncStorage for a token to determine if the user is logged in
        const bootstrapAsync = async () => {
            let token;
            try {
                token = await AsyncStorage.getItem('userToken');
                console.log("Retrieved token on app startup:", token); // Logging the token retrieved
            } catch (e) {
                console.error(e);
            }
            setUserToken(token);
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    const authContext = {
        signIn: async (data) => { // Now expects a token string directly
            console.log("Login response data:", data);
            try {
                const { token, userId } = data; // Destructure token and userId from data
                await AsyncStorage.setItem('userToken', token); // Store the token
                await AsyncStorage.setItem('userId', userId.toString()); // Store the userId
                setUserToken(token); // Update state with the new token
                console.log("Token and userId set after login:", token, userId);
            } catch (error) {
                console.error("Error setting user token and userId in signIn:", error);
                // Consider handling this error (e.g., by showing an alert or retrying)
            }
        },
        signOut: async () => {
            try {
                await AsyncStorage.removeItem('userToken'); // Remove the token from storage
                await AsyncStorage.removeItem('userId'); // Remove the userId
                setUserToken(null); // Update state to reflect user logout
                console.log("Token and userId removed after logout");
            } catch (error) {
                console.error("Error removing user token and userId in signOut:", error);
                // Consider handling this error
            }
        },
        userToken,
    };


    return (
        <AuthContext.Provider value={authContext}>
            {!isLoading ? children : null}
        </AuthContext.Provider>
    );
};
