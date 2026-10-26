import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Principal</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("Gps")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Ir para GPS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Accelerometer")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Ir para Acelerômetro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Camera")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Ir para Câmera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
      title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#0284C7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "60%",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
