import React, { useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const AddPostActionScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const openGallery = async () => {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 1,
            });

            if (result.didCancel || result.errorCode) {
                navigation.goBack();
            } else {
                const source = { uri: result.assets[0].uri };
                navigation.navigate('NewPost', { image: source });
            }
        };

        openGallery();
    }, [navigation]);

    return null;
};

export default AddPostActionScreen;
