import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";
import { PTSerif_400Regular } from "@expo-google-fonts/pt-serif";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { AnimatedSplashOverlay } from "@/components/animated-icon";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Poppins: Poppins_400Regular,
    "JetBrains Mono": JetBrainsMono_400Regular,
    "PT Serif": PTSerif_400Regular,
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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="patients" />
        <Stack.Screen name="new-patient" />
      </Stack>
    </ThemeProvider>
  );
}
