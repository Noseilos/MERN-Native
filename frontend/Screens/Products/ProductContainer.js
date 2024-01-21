import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';

import ProductList from './ProductList';

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
        <View style={styles.container}>
            <FlatList
                numColumns={numColumns}
                key={numColumns}
                showsHorizontalScrollIndicator={false}
                data={products}
                renderItem={({ item }) => <ProductList key={item.id} item={item} />}
                keyExtractor={(item) => item.name}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      marginTop: 50,
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
  });

export default ProductContainter;