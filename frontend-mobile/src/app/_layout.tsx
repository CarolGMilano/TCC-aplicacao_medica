import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import {
  AtkinsonHyperlegibleNext_400Regular,
  AtkinsonHyperlegibleNext_500Medium,
  AtkinsonHyperlegibleNext_600SemiBold,
} from "@expo-google-fonts/atkinson-hyperlegible-next";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AnimatedSplashOverlay } from "@/components/ui/animated-icon";
import { Theme } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

// O app só tem tema claro: sem isso, o modo escuro do celular pinta o fundo
// das telas de preto e deixa os ícones da barra de status claros.
const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Theme.background },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Atkinson: AtkinsonHyperlegibleNext_400Regular,
    // Pesos registrados com nome próprio: no Android, fontWeight não
    // escolhe o arquivo certo de uma fonte customizada.
    "Atkinson-Medium": AtkinsonHyperlegibleNext_500Medium,
    "Atkinson-SemiBold": AtkinsonHyperlegibleNext_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style="dark" />
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="patients" />
        <Stack.Screen name="patients/[id]" />
        <Stack.Screen name="patients/[id]/new-record" />
        <Stack.Screen name="new-patient" />
      </Stack>
    </ThemeProvider>
  );
}
