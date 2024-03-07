import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const NewPostScreen = ({ route }) => {
    const [caption, setCaption] = useState('');
    const navigation = useNavigation();
    const { image } = route.params; // Assuming { uri: "<image_uri>" }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={handlePost} title="Post" />
            ),
            title: 'New Post',
        });
    }, [navigation, handlePost]);

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            return token;
        } catch (error) {
            Alert.alert("Error", "Unable to retrieve the token.");
            return null;
        }
    };

    const handlePost = async () => {
        const token = await getToken();
        if (!token) {
            Alert.alert("Error", "Authentication token not found. Please login again.");
            return;
        }

        const formData = new FormData();
        formData.append('image', {
            name: 'upload.jpg',
            type: 'image/jpeg',
            uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
        });
        formData.append('caption', caption);

        try {
            const response = await fetch('http://10.0.2.2:3000/api/posts', { // Adjust your API endpoint accordingly
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                Alert.alert("Success", "Your post has been uploaded successfully.");
                navigation.navigate('Home'); // Navigate to Home Screen or your desired screen
            } else {
                const errorData = await response.text();
                throw new Error(`Failed to upload post: ${errorData}`);
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <TextInput
                style={styles.input}
                placeholder="Write a caption..."
                value={caption}
                onChangeText={setCaption}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
    },
    image: {
        width: '100%',
        height: 300, // Adjust based on your UI requirement
        resizeMode: 'cover',
        marginVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        width: '100%',
        padding: 10,
        textAlignVertical: 'top',
        height: 100, // Adjust based on your UI requirement
    },
});

export default NewPostScreen;
