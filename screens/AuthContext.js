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
        signIn: async (token) => { // Now expects a token string directly
            try {
                await AsyncStorage.setItem('userToken', token); // Store the token
                setUserToken(token); // Update state with the new token
                console.log("Token set after login:", token); // Logging the token set after login
            } catch (error) {
                console.error("Error setting user token in signIn:", error);
                // Consider handling this error (e.g., by showing an alert or retrying)
            }
        },
        signOut: async () => {
            try {
                await AsyncStorage.removeItem('userToken'); // Remove the token from storage
                setUserToken(null); // Update state to reflect user logout
                console.log("Token removed after logout"); // Logging the token removal after logout
            } catch (error) {
                console.error("Error removing user token in signOut:", error);
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
