import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,TextInput , ActivityIndicator, Keyboard, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native';
import * as Location from "expo-location"
import { useNavigation } from '@react-navigation/native';

export default function Gps() {
   

  const [address, setAddress] = useState<string>("Av. Paulista, 1578, São Paulo");

  const [results, setResults] = useState<Location.LocationGeocodedLocation[]>([]);
  // Controlar o carregamento das operações

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Função para solicitar a permissão do GPS.
  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        const msg = "Permissão de localização negada";
        setErrorMessage(msg);
        Alert.alert("Permissão necessária")
        return false;
      }

      return true;
    } catch (error) {
      setErrorMessage("Falha ao solicitar permissão!");
      return false;
    }
  }

  const handleSearchCoordinates = async () => {
    // Oculta o teclado virtual do dispositivos para focar na resposta da tela
    Keyboard.dismiss();

    // Remove espaços em branco
    const trimeedAddress = address.trim();

    if (!trimeedAddress) {
      Alert.alert("Campo vazio", "Por favor, digite um endereço para pesquisar.")
      return
    }

    const granted = await requestPermission();
    if (!granted) return;

    try {
      setLoading(true);
      setErrorMessage(null);
      setHasSearched(true);

      const geocodedLocations = await Location.geocodeAsync(trimeedAddress);

      setResults(geocodedLocations);

      if (geocodedLocations.length === 0) {
        setErrorMessage("Nenhuma coordenada encontrada para o endereço informado.")
      }

    } catch (error) {
      setErrorMessage("Erro ao geocodificar o endereço")
      setResults([]);

    } finally {
      setLoading(false)
    }
  }




  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar  />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Geocodificação Direta</Text>
          <Text style={styles.subtitle}>
            Converta um endereço textual em coordenadas geográficas (Latitude e
            Longitude)
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Endereço:</Text>
          <TextInput
            style={styles.textInput}
            value={address}
            onChangeText={setAddress}
            placeholder="Ex: Av. Paulista, 1578, São Paulo"
            placeholderTextColor="#94a3b8"
            returnKeyType="search"
            onSubmitEditing={handleSearchCoordinates}
            clearButtonMode="while-editing"
          />

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.buttonDisabled]}
            onPress={handleSearchCoordinates}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>🔍 Buscar Coordenadas</Text>
            )}
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>
              Buscando coordenadas do endereço...
            </Text>
          </View>
        )}

        {errorMessage && !loading && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Aviso / Erro</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        )}

        {results.length > 0 && !loading && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsHeader}>
              Coordenadas Encontradas ({results.length}):
            </Text>

            {results.map((loc, index) => (
              <View key={index} style={styles.resultCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.resultIndex}>Resultado #{index + 1}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Geocode</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Latitude:</Text>
                  <Text style={styles.value}>{loc.latitude.toFixed(6)}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Longitude:</Text>
                  <Text style={styles.value}>{loc.longitude.toFixed(6)}</Text>
                </View>

                {loc.altitude !== null && loc.altitude !== undefined && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Altitude:</Text>
                      <Text style={styles.value}>
                        {loc.altitude.toFixed(2)} m
                      </Text>
                    </View>
                  </>
                )}

                {loc.accuracy !== null && loc.accuracy !== undefined && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Precisão:</Text>
                      <Text style={styles.value}>
                        ± {loc.accuracy.toFixed(2)} m
                      </Text>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
        )}

        {!hasSearched && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🗺️</Text>
            <Text style={styles.emptyStateText}>
              Digite um endereço acima e clique em "Buscar Coordenadas" para
              obter a latitude e a longitude.
            </Text>
          </View>
        )}
    
       

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 320,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 360,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingBox: {
    marginVertical: 20,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
  },
  errorCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#b91c1c",
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 13,
    color: "#991b1b",
    lineHeight: 18,
  },
  resultsContainer: {
    width: "100%",
    maxWidth: 360,
    marginTop: 12,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultIndex: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  badge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "600",
  },
  emptyState: {
    marginTop: 24,
    alignItems: "center",
    maxWidth: 280,
  },
  emptyStateIcon: {
    fontSize: 42,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
});