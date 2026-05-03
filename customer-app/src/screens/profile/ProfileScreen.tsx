import React from 'react';
import { View, Text } from 'react-native';
import theme from '../../constants/theme';

const HomeScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.COLORS.background }}>
        <Text style={{ fontSize: 20, fontFamily: theme.FONTS.bold, color: theme.COLORS.textTitle }}>Profile Screen</Text>
    </View>
);

export default HomeScreen;