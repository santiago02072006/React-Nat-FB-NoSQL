import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const res = await fetch("https://fakestoreapi.com/products");
      const json = await res.json();
      setData(json);

    };

    obtenerDatos();
  }, []);

  return (
    <ScrollView>
      <View style={styles.lista}>
        {data.map((product, index) => (
          <View key={index} style={styles.item}>
            <Text>{product.id} - {product.title}</Text>
            <Image
              source={{ uri: product.image }}
              style={styles.imagen}
            />
          </View>
        ))}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'space-between',
    padding: 10,
  },
  item: {
    backgroundColor: 'aliceblue',
    width: '48%',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  buscador: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
});
