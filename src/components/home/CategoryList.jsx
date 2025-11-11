import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import CategoryCard from './CategoryCard';

export default function CategoryList({ categories, onCategoryPress }) {
  const renderCategoria = ({ item }) => (
    <CategoryCard category={item} onPress={onCategoryPress} />
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderCategoria}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriasList}
    />
  );
}

const styles = StyleSheet.create({
  categoriasList: {
    paddingHorizontal: 15,
  },
});