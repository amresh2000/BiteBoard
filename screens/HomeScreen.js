import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useAuth } from './AuthContext'; // Ensure this path is correct based on your project structure

function HomeScreen({ navigation }) {
    const { signOut } = useAuth(); // Destructure the signOut function from the context

    const handleLogout = async () => {
        try {
            await signOut();
            console.log("Logout successful, token removed"); // Logging the successful removal of token
            // Use the signOut function from AuthContext
            // No need to navigate to 'Login' explicitly here as the app's state will automatically change to reflect the logout
        } catch (error) {
            Alert.alert("Logout Error", "Failed to log out.");
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            <Button
                title="Go to Profile"
                onPress={() => navigation.navigate('Profile')}
            />

            <Button
                title="Logout"
                onPress={handleLogout}
            />
        </View>
    );
}

export default HomeScreen;
