import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-elements';

const ProfileScreen = () => {
    const [userProfile, setUserProfile] = useState({
        username: '',
        bio: '',
        profileImageUrl: require('../assets/default-avatar.png'),
    });
    const [userPosts, setUserPosts] = useState([]);

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            return token;
        } catch (error) {
            Alert.alert("Error", "Unable to retrieve user token.");
            return null;
        }
    };

    const fetchUserProfile = async () => {
        const token = await getToken();
        if (!token) {
            Alert.alert("Error", "Token not found. Please login again.");
            return;
        }

        try {
            const response = await fetch('http://10.0.2.2:3000/api/user/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.status === 200) {
                setUserProfile(data);
            } else {
                Alert.alert("Error", "Failed to fetch user profile.");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while fetching user profile.");
        }
    };

    const fetchUserPosts = async () => {
        const token = await getToken();
        if (!token) {
            Alert.alert("Error", "Token not found. Please login again.");
            return;
        }

        try {
            const response = await fetch('http://10.0.2.2:3000/api/posts/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.status === 200) {
                setUserPosts(data);
            } else {
                Alert.alert("Error", "Failed to fetch user posts.");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while fetching user posts.");
        }
    };

    useEffect(() => {
        fetchUserProfile();
        fetchUserPosts();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <Avatar
                    size="large"
                    rounded
                    source={{ uri: userProfile.profileImageUrl }}
                />
                <Text style={styles.username}>{userProfile.username}</Text>
                <Text style={styles.bio}>{userProfile.bio}</Text>
            </View>
            <FlatList
                data={userPosts}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Image
                            style={styles.image}
                            resizeMode="cover"
                            source={{ uri: item.imageUrl }}
                        />
                    </View>
                )}
                keyExtractor={item => item._id.toString()}
                numColumns={3}
                contentContainerStyle={styles.grid}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    bio: {
        fontSize: 14,
        color: 'grey',
        marginTop: 5,
        textAlign: 'center',
    },
    grid: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        width: Dimensions.get('window').width / 3,
        height: Dimensions.get('window').width / 3,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default ProfileScreen;

