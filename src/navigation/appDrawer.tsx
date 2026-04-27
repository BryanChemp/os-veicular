import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components/native";

import { HomeScreen } from "../screens/HomeScreen";
import FormTabs from "./tabs";
import { CustomDrawer } from "../components/CustomDrawer";
import CadastrarItemScreen from "../screens/CadastrarItemScreen";
import ListaOrcamentosFinalizados from "../screens/ListaOrcamentosFinalizados";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function FloatingMenuButton() {
	const navigation = useNavigation<any>();

	return (
		<HeaderContainer>
			<Button onPress={() => navigation.openDrawer()}>
				<FontAwesomeIcon icon={faBars} size={20} color="#868686" />
			</Button>
		</HeaderContainer>
	);
}

function ScreenWithMenu({ children }: any) {
	return (
		<Container>
			<FloatingMenuButton />
			<Content>{children}</Content>
		</Container>
	);
}

function HomeStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="Home"
				component={() => (
					<ScreenWithMenu>
						<HomeScreen />
					</ScreenWithMenu>
				)}
			/>

			<Stack.Screen
				name="Form"
				component={FormTabs}
			/>
		</Stack.Navigator>
	);
}

function CadastrarItensStack() {
	return (
		<ScreenWithMenu>
			<CadastrarItemScreen />
		</ScreenWithMenu>
	);
}

function ListaOrcamentosStack() {
	return (
		<ScreenWithMenu>
			<ListaOrcamentosFinalizados />
		</ScreenWithMenu>
	);
}

export function AppDrawer() {
	return (
		<Drawer.Navigator
			screenOptions={{ headerShown: false }}
			drawerContent={(props) => <CustomDrawer {...props} />}
		>
			<Drawer.Screen name="HomeStack" component={HomeStack} />
			<Drawer.Screen name="ListaOrcamentosFinalizados" component={ListaOrcamentosStack} />
			<Drawer.Screen name="CadastrarItens" component={CadastrarItensStack} />
		</Drawer.Navigator>
	);
}

const Container = styled.View`
	flex: 1;
	background-color: #f8f9fa;
`;

const Content = styled.View`
	flex: 1;
`;

const HeaderContainer = styled.View`
	padding: 32px;
	padding-bottom: 8px;
	padding-top: 64px;
	justify-content: center;
	background-color: white;
`;

const Button = styled.TouchableOpacity`
	width: 48px;
	height: 48px;
	border-radius: 24px;
	background-color: #f5f5f5;
	justify-content: center;
	align-items: center;
	elevation: 4;
	shadow-color: #000;
	shadow-offset: 0px 2px;
	shadow-opacity: 0.2;
	shadow-radius: 3px;
`;