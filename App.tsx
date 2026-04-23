import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackRoutes from "./src/navigation/stackRoutes";

import { OrcamentoProvider } from "./src/context/ContextOrcamento";

export default function App() {
  return (
    <OrcamentoProvider>
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    </OrcamentoProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
