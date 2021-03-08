import React, {useState} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    Image,
    StatusBar
} from 'react-native';

const SplashScreen = (props) => {
    return (
        <View style={[styles.container, styles.center]}>
            <StatusBar barStyle="light-content" />
            <Image
                style={{width: '60%'}}
                width={'60%'} 
                resizeMode={'contain'}
                source={require('../../Assets/logo_vertical.png')}
            />
            <View style={{height: 80}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000000",
        flex: 1,
    },
    flex_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    shadow: {
        shadowColor: '#aaa',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(SplashScreen);
