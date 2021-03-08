import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

const DonationAlert = (props) => {

    const {data, confirnAction, dismissAction} = props
    const [totalPrice, setTotalPrice] = useState(0)
    const [donations, setDonations] = useState(null)
    const [maxBarLength, setMaxBarLength] = useState(0)

    useEffect(() => {
        setupDonations()
    }, [data])

    const setupDonations = () => {
        if(data === null || data.donations.length < 1) return;

        
        let history = JSON.parse(data.donations[0].donation_history)
        history = history.sort((a, b) => {
            return parseInt(a.amount) < parseInt(b.amount) ? 1 : -1
        })

        setDonations(history)
        let total = 0
        for(i = 0; i < history.length; i++) {
            const item = history[i]
            history[i].amount = parseInt(history[i].amount)
            total = total + history[i].amount
        }

        setTotalPrice(total)
    }

    const _renderDonateItem = (item, key) => {
        return (
            <View key={key} style={{paddingVertical: 6}}>
                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#1e1e1e', marginBottom: 4, lineHeight: 18}}>{item.name}</Text>
                <View style={[styles.flex_row]}>
                    {
                        key === 0 ? (
                            <View 
                                style={{height: 20, flex: 1, backgroundColor: '#04dea0', borderRadius: 2}}
                                onLayout={(e) => {
                                    const layout = e.nativeEvent.layout
                                    setMaxBarLength(layout.width)
                                }}
                            />
                        ) : (
                            <View style={{height: 20, backgroundColor: '#04dea0', borderRadius: 2, width: item.amount*maxBarLength/donations[0].amount}}/>
                        )
                    }
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#1e1e1e', marginLeft: 8, lineHeight: 24}}>
                        {item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                    </Text>
                </View>
            </View>
        )
    }

    return (
        data &&
        <View style={[styles.container, styles.center]}>
            <View style={{marginHorizontal: 16, backgroundColor: '#FFFFFF', paddingTop: 36, alignSelf: 'stretch', borderRadius: 4, overflow: 'hidden', height: '80%'}}>
                <TouchableOpacity 
                    style={styles.header_right}
                    onPress={dismissAction}
                >
                    <Ionicons
                        size={24}
                        color={'#1e1e1e'}
                        name={'close'}
                    />
                </TouchableOpacity>
                <View style={{paddingHorizontal: 16}}>
                    <Image
                        style={{width: 72, height: 72}}
                        width={72}
                        height={72}
                        source={require('../../Assets/ic_report.png')}
                    />
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 20, color: '#1e1e1e', marginTop: 20, lineHeight: 28}}>
                        {`${data.campaign.organization.name}의\n${data.campaign.name} 프로젝트`}
                    </Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', marginTop: 16, lineHeight: 24}}>{`월드비전은 yj1113님이 기부하신`}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', lineHeight: 24}}>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Bold', fontSize: 16}}>
                            총 {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 
                        </Text>
                        을 다음 캠페인에 사용하였습니다.
                    </Text>
                    <View style={{height: 24}}/>
                </View>
                
                <ScrollView style={{paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32, backgroundColor: '#ececec', flex: 1}}>
                    {donations && donations.map((item,key) => {
                        return _renderDonateItem(item, key)
                    })}
                    <View style={{height: 40}}/>
                </ScrollView>
                
                <TouchableOpacity 
                    style={[styles.center, {height: 56, width: '100%', backgroundColor: '#04dea0'}]}
                    onPress={()=>{
                        confirnAction()
                        dismissAction()
                    }}
                >
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#ffffff'}}>월드비전 홈페이지 방문하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000000CC",
    },
    flex_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    header_right: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        padding: 16
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
)(DonationAlert);
