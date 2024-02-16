import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { Container, Header, Icon, Item, Input, Text } from 'native-base';

import ProductList from './ProductList';

var { height } = Dimensions.get('window')

const data = require('../../assets/data/products.json')

const ProductContainter = () => {

    const [products, setProducts] = useState([])
    const [numColumns, setNumColumns] = useState(2);

    useEffect(() =>{
        setProducts(data)

        return () => {
            setProducts([]);
        }
    },[]);

    return (
        <Container>
            <Header searchBar rounded>
                <Item>
                    <Icon name='ios-search'/>
                    <Input
                        placeholder='Search'
                        // onFocus = {}
                        // onChangeText = {(test) =>}
                    />
                </Item>
            </Header>
            <View style={styles.container}>
                <View style={styles.listContainer}>
                    <FlatList
                        numColumns={numColumns}
                        key={numColumns}
                        showsHorizontalScrollIndicator={false}
                        data={products}
                        renderItem={({ item }) => <ProductList key={item.id} item={item} />}
                        keyExtractor={(item) => item.name}
                    />
                </View>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
      flexWrap: "wrap",
      backgroundColor: "gainsboro",
    },
    listContainer: {
      height: height,
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      flexWrap: "wrap",
      backgroundColor: "gainsboro",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
  });

export default ProductContainter;