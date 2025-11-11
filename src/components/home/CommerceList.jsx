import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import CommerceCard from './CommerceCard';

export default function CommerceList({ comercios, onCommercePress }) {
  const renderComercioItem = ({ item }) => (
    <CommerceCard commerce={item} onPress={() => onCommercePress(item)} />
  );

  return (
    <FlatList
      data={comercios}
      renderItem={renderComercioItem}
      keyExtractor={(item) => item.idcomercio.toString()}
      numColumns={2}
      scrollEnabled={false}
      contentContainerStyle={styles.comerciosGrid}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
}

const styles = StyleSheet.create({
  comerciosGrid: {
    paddingHorizontal: 15,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});