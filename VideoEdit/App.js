import React, { useState, useRef } from 'react';
import { StatusBar, Modal, StyleSheet, Image, Text, View, TouchableOpacity, PanResponder } from 'react-native';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [croppedImageUri, setCroppedImageUri] = useState(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        setPan({ x: gesture.dx, y: gesture.dy });
      },
    })
  ).current;

  const cropImage = () => {
    if (imageUri) {
      const cropData = {
        offset: { x: -pan.x, y: -pan.y },
        size: { width: 200, height: 200 },
        displaySize: { width: 200, height: 200 },
        resizeMode: 'contain',
      };

      ImageEditor.cropImage(
        imageUri,
        cropData,
        (croppedImageUri) => {
          setCroppedImageUri(croppedImageUri);
          setModalVisible(false);
        },
        (error) => {
          console.log('Ошибка при обрезании фотографии:', error);
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/images/1666271042.jpg')}
        style={{ width: 200, height: 200 }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Button 1</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              source={require('./assets/images/1666271042.jpg')}
              style={{ width: 200, height: 200 }}
            />
            <View
              style={[
                styles.cropFrame,
                { left: pan.x, top: pan.y, transform: [{ translateX: -100 }, { translateY: -100 }] },
              ]}
              {...panResponder.panHandlers}
            />
            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Закрыть</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={cropImage}
            >
              <Text style={styles.buttonText}>Обрезать Фотографию</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cropFrame: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: 'transparent',
  },
});
