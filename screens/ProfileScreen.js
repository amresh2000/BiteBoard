import React from 'react';
import { View, Text, Button } from 'react-native';

function ProfileScreen({ navigation }) {
    const handleLogout = () => {
        // This resets the navigation stack and navigates the user to the LoginScreen
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }], // Make sure 'Login' matches the name of your LoginScreen in the navigator
        });
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Profile Screen</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}

export default ProfileScreen;
