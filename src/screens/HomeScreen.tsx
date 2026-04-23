import React, { useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import styled from "styled-components/native";
import { OrcamentoContext } from "../context/ContextOrcamento";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Footer } from "../components/Footer";
import logoApp from "../assets/logo_app.png";
import { useItemStore } from "../store/useItemStore";

export const HomeScreen: React.FC = () => {
	const navigation = useNavigation<any>();
	const contextOrcamento = useContext(OrcamentoContext);

	const { fetchItems } = useItemStore();

	useEffect(() => {
		fetchItems();
	}, []);

	const atualizarPlaca = (placa: string) => {
		if (contextOrcamento) {
			contextOrcamento.setVeiculo({
				...contextOrcamento.veiculo,
				placa: placa,
			});
		}
	};

	return (
		<KeyboardAwareScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			enableOnAndroid
			enableAutomaticScroll
			keyboardShouldPersistTaps="handled"
			extraScrollHeight={Platform.OS === "ios" ? 80 : 0}
			showsVerticalScrollIndicator={false}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<Container>
					<Content>
						<Logo source={logoApp} resizeMode="contain" />

						<Info>
							Digite a <Bold>placa</Bold> para iniciar um
							orçamento
						</Info>

						<Input
							placeholder="PLACA"
							value={contextOrcamento?.veiculo.placa}
							onChangeText={atualizarPlaca}
							autoCapitalize="characters"
							maxLength={7}
						/>

						<Button onPress={() => navigation.navigate("Form")}>
							<ButtonText>Iniciar Orçamento</ButtonText>
						</Button>
					</Content>
					<Footer />
				</Container>
			</TouchableWithoutFeedback>
		</KeyboardAwareScrollView>
	);
};

const Container = styled.View`
	flex: 1;
	background-color: white;
`;

const Content = styled.View`
	flex: 1;
	width: 100%;
	justify-content: center;
	align-items: center;
	padding: 64px;
	padding-top: 0px;
`;

const Logo = styled.Image`
	width: 180px;
	height: 120px;
	margin-bottom: 16px;
`;

const Info = styled.Text`
	width: 100%;
	padding: 32px;
	border-radius: 12px;
	padding: 10px;
	margin-bottom: 30px;
	text-align: center;
	font-size: 16px;
`;

const Bold = styled.Text`
	font-weight: bold;
`;

const Input = styled.TextInput`
	width: 100%;
	border-radius: 12px;
	border-width: 1px;
	border-color: #ccc;
	padding: 16px;
	font-size: 16px;
	margin-top: 30px;
	text-align: center;
`;

const Button = styled.TouchableOpacity`
	background-color: #5e74ff;
	width: 100%;
	border-radius: 12px;
	padding: 10px;
	align-items: center;
	justify-content: center;
	margin-top: 30px;
	padding: 20px;
`;

const ButtonText = styled.Text`
	font-size: 16px;
	color: #fff;
	font-weight: bold;
`;
