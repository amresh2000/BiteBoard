import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewPostScreen from '../screens/NewPostScreen'; // Adjust the path as necessary
import AddPostActionScreen from '../screens/AddPostActionScreen'; // Adjust the path as necessary

const Stack = createStackNavigator();

function AddPostStack() {
    return (
        <Stack.Navigator initialRouteName="AddPostAction">
            <Stack.Screen
                name="AddPostAction"
                component={AddPostActionScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="NewPost"
                component={NewPostScreen}
                options={{ title: 'New Post' }}
            />
        </Stack.Navigator>
    );
}

export default AddPostStack;
