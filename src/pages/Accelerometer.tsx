import {useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Accelerometer } from 'expo-sensors';
//Tipo simples para os dados do acelerometro
interface AccelerometerData{
  x: number;
  y: number;
  z: number;
}
export default function Acelerometro() {
  //Estado para armazenar os valores capturados
    const [data, setData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 })
    // Estado para controlar se o sensor está ativo ou pausado
    const [isActive, setIsActive] = useState<boolean>(false);
    //Referencia para guardar a assinatira do sensor sem criar renderizacoes
    const subscriprionRef = useRef<{ remove: () => void} | null>(null)
    //Funcao para iniciar a captura do acelerometro
    const startListening = () => {
      //definindo a frequencia de atualizacao(100ms = 10 leituras por segundo)
      Accelerometer.setUpdateInterval(100);
      subscriprionRef.current = Accelerometer.addListener((sensorData) => {
        setData({
          x: sensorData.x,
          y: sensorData.y,
          z:sensorData.z,
        })
      })
      setIsActive(true);
    }
    // Funcao para PARAR a captura de dados
    const stopListening = () => {
      if (subscriprionRef.current) {
        subscriprionRef.current.remove();
        subscriprionRef.current = null;
      }
      setIsActive(false);
    }
    // Garantir a remocao da inscricao (useRef) quando o componete for desmontado
    // isso evita vazamento de memoria
    useEffect(() => {
      return() => {
        if (subscriprionRef.current) {
        subscriprionRef.current.remove();
        subscriprionRef.current = null;
      }
      }
    },[])
    const formatValue = (value: number) => {
      const formatted = value.toFixed(2);
      return value >= 0 ?`+${formatted}` : formatted;
    }
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar  />
      <View style={styles.container}>
        {/* ================================================================ */}
        {/* CABEÇALHO                                                       */}
        {/* ================================================================ */}
        <View style={styles.header}>
          <Text style={styles.title}>Demonstração do Acelerômetro</Text>
          <Text style={styles.subtitle}>
            Movimente o celular e observe os valores dos eixos X, Y e Z.
          </Text>
          {/* Indicador de status (Ativo / Pausado) */}
          <View
            style={[
              styles.statusBadge,
              isActive ? styles.statusBadgeActive : styles.statusBadgeInactive,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isActive ? "#16A34A" : "#94A3B8" },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: isActive ? "#15803D" : "#64748B" },
              ]}
            >
              {isActive ? "Sensor Ativo (Lendo dados...)" : "Sensor Pausado"}
            </Text>
          </View>
        </View>
        {/* ================================================================ */}
        {/* CARTÕES COM OS VALORES DOS EIXOS X, Y e Z                       */}
        {/* ================================================================ */}
        <View style={styles.cardsContainer}>
          {/* Card Eixo X */}
          <View style={[styles.card, styles.cardX]}>
            <Text style={[styles.cardAxis, { color: "#0284C7" }]}>Eixo X</Text>
            <Text style={styles.cardValue}>{formatValue(data.x)}</Text>
            <Text style={styles.cardUnit}>g (força)</Text>
          </View>
          {/* Card Eixo Y */}
          <View style={[styles.card, styles.cardY]}>
            <Text style={[styles.cardAxis, { color: "#16A34A" }]}>Eixo Y</Text>
            <Text style={styles.cardValue}>{formatValue(data.y)}</Text>
            <Text style={styles.cardUnit}>g (força)</Text>
          </View>
          {/* Card Eixo Z */}
          <View style={[styles.card, styles.cardZ]}>
            <Text style={[styles.cardAxis, { color: "#EA580C" }]}>Eixo Z</Text>
            <Text style={styles.cardValue}>{formatValue(data.z)}</Text>
            <Text style={styles.cardUnit}>g (força)</Text>
          </View>
        </View>
        {/* ================================================================ */}
        {/* BOTÃO DE CONTROLE (INICIAR / PARAR)                              */}
        {/* ================================================================ */}
        <TouchableOpacity
          style={[
            styles.button,
            isActive ? styles.buttonStop : styles.buttonStart,
          ]}
          onPress={isActive ? stopListening : startListening}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isActive ? "Parar Acelerômetro" : "Iniciar Acelerômetro"}
          </Text>
        </TouchableOpacity>
        {/* ================================================================ */}
        {/* SEÇÃO DIDÁTICA: EXPLICAÇÃO DOS EIXOS                             */}
        {/* ================================================================ */}
        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>Entenda os eixos:</Text>
          <View style={styles.axisItem}>
            <Text
              style={[
                styles.axisTag,
                { backgroundColor: "#E0F2FE", color: "#0369A1" },
              ]}
            >
              X
            </Text>
            <Text style={styles.axisDescription}>
              Movimento para <Text style={styles.bold}>esquerda / direita</Text>
            </Text>
          </View>
          <View style={styles.axisItem}>
            <Text
              style={[
                styles.axisTag,
                { backgroundColor: "#DCFCE7", color: "#15803D" },
              ]}
            >
              Y
            </Text>
            <Text style={styles.axisDescription}>
              Movimento para <Text style={styles.bold}>frente / trás</Text>
            </Text>
          </View>
          <View style={styles.axisItem}>
            <Text
              style={[
                styles.axisTag,
                { backgroundColor: "#FFEDD5", color: "#C2410C" },
              ]}
            >
              Z
            </Text>
            <Text style={styles.axisDescription}>
              Movimento para <Text style={styles.bold}>cima / baixo</Text>{" "}
              (perpendicular à tela)
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  
 safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: 12,
    lineHeight: 20,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  statusBadgeActive: {
    backgroundColor: "#DCFCE7",
  },
  statusBadgeInactive: {
    backgroundColor: "#F1F5F9",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    // Sombra suave para visual moderno
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardX: {
    borderColor: "#BAE6FD",
  },
  cardY: {
    borderColor: "#BBF7D0",
  },
  cardZ: {
    borderColor: "#FED7AA",
  },
  cardAxis: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: 0.5,
  },
  cardUnit: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonStart: {
    backgroundColor: "#0284C7",
  },
  buttonStop: {
    backgroundColor: "#DC2626",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  explanationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 10,
  },
  axisItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  axisTag: {
    width: 24,
    height: 24,
    borderRadius: 6,
    textAlign: "center",
    lineHeight: 24,
    fontSize: 12,
    fontWeight: "800",
    marginRight: 10,
    overflow: "hidden",
  },
  axisDescription: {
    fontSize: 13,
    color: "#475569",
    flex: 1,
  },
  bold: {
    fontWeight: "700",
    color: "#0F172A",
  },
});