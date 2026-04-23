import React, { useState } from "react";
import {
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	ActivityIndicator,
	Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";
import { Campo } from "../components/Campos";
import { Footer } from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import logoApp from "../assets/logo_app.png";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {
	const { loading, login } = useAuth();
	const nav = useNavigation();

	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");

	const validar = () => {
		if (!email || !senha) {
			Alert.alert("Atenção", "Preencha e-mail e senha.");
			return false;
		}

		if (!email.includes("@")) {
			Alert.alert("Atenção", "E-mail inválido.");
			return false;
		}

		return true;
	};

	const handleLogin = async () => {
		if (!validar()) return;
		await login(email, senha);
	};

	const handleCadastrar = () => {
		nav.navigate("Cadastro" as never);
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<ScrollContainer
				enableOnAndroid={true}
				enableAutomaticScroll={true}
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={Platform.OS === "ios" ? 80 : 20}
				showsVerticalScrollIndicator={false}
			>
				<HeaderContainer>
					<LogoImage source={logoApp} resizeMode="contain" />
					<Title>Bem-vindo(a)</Title>
					<Subtitle>Faça login para continuar</Subtitle>
				</HeaderContainer>

				<FieldsWrapper pointerEvents={loading ? "none" : "auto"}>
					<Campo
						label="E-mail"
						value={email}
						onChangeText={setEmail}
						inputProps={{
							placeholder: "Digite seu e-mail",
							editable: !loading,
							autoCapitalize: "none",
							keyboardType: "email-address",
						}}
					/>

					<Campo
						label="Senha"
						value={senha}
						onChangeText={setSenha}
						campoSenha
						inputProps={{
							placeholder: "Digite sua senha",
							editable: !loading,
						}}
					/>
				</FieldsWrapper>

				<PrimaryButton disabled={loading} onPress={handleLogin}>
					{loading ? (
						<ActivityIndicator color="#fff" />
					) : (
						<ButtonText>Entrar</ButtonText>
					)}
				</PrimaryButton>

				<FooterTouchable onPress={handleCadastrar} disabled={loading}>
					<FooterText>
						Não possui cadastro?{" "}
						<HighlightText>Cadastrar</HighlightText>
					</FooterText>
				</FooterTouchable>

				<Footer />
			</ScrollContainer>
		</TouchableWithoutFeedback>
	);
}

const ScrollContainer = styled(KeyboardAwareScrollView).attrs({
	contentContainerStyle: {
		paddingHorizontal: 24,
		paddingTop: 64,
		paddingBottom: 48,
		flexGrow: 1,
		justifyContent: "center",
	},
})`
	flex: 1;
	background-color: #f8f9fa;
`;

const HeaderContainer = styled.View`
	align-items: center;
	margin-bottom: 48px;
`;

const LogoImage = styled.Image`
	width: 180px;
	height: 120px;
	margin-bottom: 24px;
	border-radius: 24px;
`;

const Title = styled.Text`
	font-size: 24px;
	font-weight: bold;
	color: #2d3142;
	margin-bottom: 8px;
`;

const Subtitle = styled.Text`
	font-size: 16px;
	color: #6c757d;
`;

const FieldsWrapper = styled.View`
	margin-bottom: 32px;
	gap: 16px;
`;

const PrimaryButton = styled.TouchableOpacity`
	background-color: #5a6bff;
	height: 56px;
	border-radius: 12px;
	justify-content: center;
	align-items: center;
	margin-bottom: 24px;
`;

const ButtonText = styled.Text`
	color: #ffffff;
	font-size: 18px;
	font-weight: bold;
`;

const FooterTouchable = styled.TouchableOpacity`
	align-items: center;
	padding: 8px;
`;

const FooterText = styled.Text`
	font-size: 15px;
	color: #2d3142;
`;

const HighlightText = styled.Text`
	color: #5a6bff;
	font-weight: bold;
`;
1;
