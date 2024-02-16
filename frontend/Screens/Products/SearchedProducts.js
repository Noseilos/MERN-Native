import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Content, Left, Body, ListItem, Thumbnail, Text } from 'native-base'

var { width } = Dimensions.get('window')

const SearchedProducts = (props) => {

    const { productsFiltered } = props;

  return (
    <Content style={{ width: width }}>
        {productsFiltered.length > 0 ? (
            productsFiltered.map((item) => (
                <ListItem
                    // onPress = {navigation}
                    key = {item._id.$oid}
                    avatar
                >
                    <Left>
                        <Thumbnail 
                            source = {{ uri: item.image ? item.image : 'https://media.istockphoto.com/id/520619396/photo/isolated-shot-of-opened-blank-cardboard-box-on-white-background.jpg?s=612x612&w=0&k=20&c=SEWCBNgOWaQH-sBqq5UnmXXFxhpMPdS9btt6MqX-85c=' }}
                        />
                    </Left>
                    <Body>
                        <Text>{item.name}</Text>
                        <Text note>{item.description}</Text>
                    </Body>
                </ListItem>
            ))
        ) : (
            <View style={styles.center}>
                <Text style = {{ alignSelf: 'center' }}>
                    No products found
                </Text>
            </View>
        )}
    </Content>
  )
}

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SearchedProducts