import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import CadastroScreen from "../screens/CadastroScreen";
import { useUserStore } from "../store/userStore";
import { AppDrawer } from "./appDrawer";

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
	const user = useUserStore((state) => state.user);

	return !user ? (
		<Stack.Navigator initialRouteName="Login">
			<Stack.Screen
				name="Login"
				component={LoginScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Cadastro"
				component={CadastroScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	) : (
		<AppDrawer />
	);
}