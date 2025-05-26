import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';

const MAX_ATTEMPTS = 5;

export default function JuegoTriviaPrecio() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [uid, setUid] = useState(null);
  const [userWin, setUserWin] = useState(0);
  const [userLose, setUserLose] = useState(0);

  // Obtener usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
    });
    return unsubscribe;
  }, []);

  // Obtener estadísticas
  useEffect(() => {
    if (!uid) return;
    const traerDatos = async () => {
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserWin(data.ganados || 0);
        setUserLose(data.perdidos || 0);
      } else {
        await setDoc(docRef, { ganados: 0, perdidos: 0 });
      }
    };
    traerDatos();
  }, [uid]);

  const fetchRandomProduct = async () => {
    setLoading(true);
    setGameOver(false);
    setGameWon(false);
    setGuess('');
    setMessage('');
    setAttempts(0);

    const id = Math.floor(Math.random() * 20) + 1;
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const data = await res.json();
    setProduct(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomProduct();
  }, []);

  const guardarResultado = async (acierto) => {
    if (!uid) return;
    const fecha = new Date().toISOString();

    const resultado = {
      uid,
      producto: product.title,
      precio: product.price,
      aciertos: acierto ? 1 : 0,
      errores: acierto ? 0 : 1,
      fecha,
    };

    try {
      await setDoc(doc(db, 'resultados', `${uid}_${fecha}`), resultado);
      const docRef = doc(db, 'usuarios', uid);
      await updateDoc(docRef, {
        ganados: acierto ? userWin + 1 : userWin,
        perdidos: !acierto ? userLose + 1 : userLose,
      });
      if (acierto) setUserWin(userWin + 1);
      else setUserLose(userLose + 1);
    } catch (e) {
      console.error('Error al guardar resultado:', e);
    }
  };

  const handleGuess = async () => {
    if (!guess) return;
    const numericGuess = parseFloat(guess);
    const actualPrice = parseFloat(product.price);

    if (numericGuess === actualPrice) {
      setGameWon(true);
      setMessage('🎉 ¡Correcto! Adivinaste el precio.');
      await guardarResultado(true);
    } else if (attempts + 1 >= MAX_ATTEMPTS) {
      setGameOver(true);
      setMessage(`💀 ¡Perdiste! El precio era $${actualPrice}`);
      await guardarResultado(false);
    } else {
      const hint = numericGuess < actualPrice ? '💡 Es mayor' : '💡 Es menor';
      setMessage(hint);
      setAttempts(attempts + 1);
    }
    setGuess('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Adivina el precio</Text>
      <Text style={styles.stats}>Ganados: {userWin} | Perdidos: {userLose}</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Image source={{ uri: product.image }} style={styles.image} />
          <Text style={styles.productTitle}>{product.title}</Text>

          {!gameOver && !gameWon && (
            <>
              <TextInput
                style={styles.input}
                value={guess}
                onChangeText={setGuess}
                placeholder="Ej: 24.99"
                keyboardType="decimal-pad"
              />
              <TouchableOpacity style={styles.button} onPress={handleGuess}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.message}>{message}</Text>
          <Text style={styles.attempts}>
            Intentos: {attempts} / {MAX_ATTEMPTS}
          </Text>

          {(gameOver || gameWon) && (
            <TouchableOpacity style={styles.button} onPress={fetchRandomProduct}>
              <Text style={styles.buttonText}>Jugar otra vez</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  stats: { fontSize: 16, marginBottom: 10 },
  image: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 10 },
  productTitle: { textAlign: 'center', fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    width: '80%',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  message: { fontSize: 16, marginVertical: 10 },
  attempts: { fontSize: 14, color: '#555' },
});
