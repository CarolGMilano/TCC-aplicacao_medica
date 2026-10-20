import { StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";

// Visual único dos campos (texto, data e seleção): fundo suave sem caixa
// branca; o contorno só aparece de verdade no foco. A borda tem sempre 1px
// para o campo não mudar de tamanho ao focar.
export const inputStyles = StyleSheet.create({
  box: {
    backgroundColor: Theme.inputBackground,
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: 12,
  },

  focused: {
    borderColor: Theme.primary,
  },
});
