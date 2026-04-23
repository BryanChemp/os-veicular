import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView, Platform } from "react-native";

import DadosScreen from "../screens/DadosScreen";
import OrcamentoScreen from "../screens/OrcamentoScreen";
import FinalizarScreen from "../screens/FinalizarScreen";

const Tab = createMaterialTopTabNavigator();

export default function FormTabs() {
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: Platform.OS === "ios" ? 64 : 44 }}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontWeight: "bold" },
          tabBarActiveTintColor: "#3D5AFE",
          tabBarIndicatorStyle: { backgroundColor: "#3D5AFE" },
        }}
      >
        <Tab.Screen name="Dados" component={DadosScreen} />
        <Tab.Screen name="Orcamento" component={OrcamentoScreen} />
        <Tab.Screen name="Finalizar" component={FinalizarScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
