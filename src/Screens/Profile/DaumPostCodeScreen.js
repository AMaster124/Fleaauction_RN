import React, {Fragment, useState, useEffect} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Text
} from 'react-native';
import Postcode from 'react-native-daum-postcode'
import Ionicons from 'react-native-vector-icons/Ionicons'

const DaumPostCodeScreen = (props) => {
    const {navigation} = props

    return (
        <Fragment>
			<StatusBar barStyle="dark-content"/>
			<SafeAreaView>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.header_left}
                        onPress={()=>{navigation.pop()}}
                    >
                        <Ionicons
                            size={24}
                            color={'#1e1e1e'}
                            name={'chevron-back'}
                        />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>
                        우편번호검색
                    </Text>
                </View>

				<View style={{ width: "100%", height: "100%" }}>
					<Postcode
						style={{ flex: 1 }}
						jsOptions={{ animation: true }}
                        onSelected={(data) => {
                            if(navigation.state.params.setCode) {
                                navigation.state.params.setCode(data.zonecode)
                            }
                            if(navigation.state.params.setAddress) {
                                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                                    navigation.state.params.setAddress(data.roadAddress)
                                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                                    navigation.state.params.setAddress(data.jibunAddress)
                                }
                            }
                            navigation.pop()
                        }}
					/>
				</View>

			</SafeAreaView>
		</Fragment>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header_left: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 16
    },

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
)(DaumPostCodeScreen);
