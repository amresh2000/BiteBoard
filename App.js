import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { AuthProvider, useAuth } from './screens/AuthContext'; // Make sure you have the AuthProvider and useAuth hook

// Import your screen components and the AuthStack navigator
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import AddPostStack from './screens/AddPostStackNavigator';
import ProfileScreen from './screens/ProfileScreen';
import AuthStack from './screens/AuthStack';

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let type = 'ionicon';

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Search':
                            iconName = focused ? 'search' : 'search-outline';
                            break;
                        case 'AddPost':
                            iconName = focused ? 'add-circle' : 'add-circle-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                    }

                    return <Icon name={iconName} type={type} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="AddPost" component={AddPostStack} options={{ tabBarBadge: 3, unmountOnBlur: true }} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

function AppContent() {
    const { userToken } = useAuth(); // Use the useAuth hook to get the userToken

    return (
        <NavigationContainer>
            {userToken ? <MyTabs /> : <AuthStack />}
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
