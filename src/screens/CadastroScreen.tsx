import React, { useState } from "react";
import {
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	Alert,
	ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";
import { Campo } from "../components/Campos";
import { formatCnpj, formatTelefone, unmask } from "../utils/mascaras";
import { useAuth } from "../hooks/useAuth";

export default function CadastroScreen() {
    const { validarCadastro, cadastrar, loading } = useAuth();

	const [step, setStep] = useState(1);

	const [nome, setNome] = useState("");
	const [empresa, setEmpresa] = useState("");
	const [cnpj, setCnpj] = useState("");
	const [telefone, setTelefone] = useState("");

	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [confirmarSenha, setConfirmarSenha] = useState("");
	const [aceitaTermos, setAceitaTermos] = useState(false);

	const handleContinuar = () => {
		if (!nome || !empresa) {
			Alert.alert("Atenção", "Preencha os campos obrigatórios.");
			return;
		}
		setStep(2);
	};

	const handleFinalizar = async () => {
		const valido = validarCadastro({
			nome,
			empresa,
			senha,
			confirmarSenha,
			aceitaTermos,
		});

		if (!valido) return;

		const sucesso = await cadastrar({
			nome,
			empresa,
			email,
			cnpj: unmask(cnpj),
			telefone: unmask(telefone),
			senha,
		});

		if (sucesso) {
			Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
		}
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
					<StepIndicator>Passo {step} de 2</StepIndicator>
					<Title>{step === 1 ? "Seus Dados" : "Credenciais"}</Title>
					<Subtitle>
						{step === 1
							? "Preencha as informações abaixo"
							: "Crie seu acesso para a plataforma"}
					</Subtitle>
				</HeaderContainer>

				{step === 1 ? (
					<FieldsWrapper pointerEvents={loading ? "none" : "auto"}>
						<Campo
							label="Nome"
							value={nome}
							onChangeText={setNome}
							inputProps={{
								placeholder: "Digite seu nome",
								editable: !loading,
							}}
						/>

						<Campo
							label="Nome da Empresa"
							value={empresa}
							onChangeText={setEmpresa}
							inputProps={{
								placeholder: "Digite o nome da sua empresa",
								editable: !loading,
							}}
						/>

						<Campo
							label="CNPJ"
							value={cnpj}
							onChangeText={(text) => setCnpj(formatCnpj(text))}
							inputProps={{
								keyboardType: "numeric",
								placeholder: "12.345.678/0001-00",
								editable: !loading,
							}}
						/>

						<Campo
							label="Telefone"
							value={telefone}
							onChangeText={(text) =>
								setTelefone(formatTelefone(text))
							}
							inputProps={{
								keyboardType: "phone-pad",
								placeholder: "(99) 99999-9999",
								editable: !loading,
							}}
						/>

						<PrimaryButton
							disabled={loading}
							onPress={handleContinuar}
							style={{ marginTop: 16 }}
						>
							{loading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<ButtonText>Continuar</ButtonText>
							)}
						</PrimaryButton>
					</FieldsWrapper>
				) : (
					<FieldsWrapper pointerEvents={loading ? "none" : "auto"}>
						<Campo
							label="E-mail"
							value={email}
							onChangeText={setEmail}
							inputProps={{
								keyboardType: "email-address",
								autoCapitalize: "none",
								placeholder: "Digite seu e-mail",
								editable: !loading,
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

						<Campo
							label="Confirmar Senha"
							value={confirmarSenha}
							onChangeText={setConfirmarSenha}
							campoSenha
							inputProps={{
								placeholder: "Repita sua senha",
								editable: !loading,
							}}
						/>

						<CheckboxContainer
							onPress={() =>
								!loading && setAceitaTermos(!aceitaTermos)
							}
							activeOpacity={0.7}
						>
							<CheckboxBox checked={aceitaTermos}>
								{aceitaTermos && <CheckMark>✓</CheckMark>}
							</CheckboxBox>
							<CheckboxLabel>
								Li e aceito os{" "}
								<HighlightText>Termos de Uso</HighlightText>
							</CheckboxLabel>
						</CheckboxContainer>

						<ButtonsRow>
							<SecondaryButton
								disabled={loading}
								onPress={() => setStep(1)}
							>
								<SecondaryButtonText>
									Voltar
								</SecondaryButtonText>
							</SecondaryButton>

							<PrimaryButtonHalf
								disabled={loading}
								onPress={handleFinalizar}
							>
								{loading ? (
									<ActivityIndicator color="#fff" />
								) : (
									<ButtonText>Finalizar</ButtonText>
								)}
							</PrimaryButtonHalf>
						</ButtonsRow>
					</FieldsWrapper>
				)}
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
	},
})`
	flex: 1;
	background-color: #f8f9fa;
`;

const HeaderContainer = styled.View`
	margin-bottom: 44px;
`;

const StepIndicator = styled.Text`
	font-size: 14px;
	font-weight: 600;
	color: #5a6bff;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 1px;
`;

const Title = styled.Text`
	font-size: 28px;
	font-weight: bold;
	color: #2d3142;
	letter-spacing: 0.3px;
	margin-bottom: 8px;
`;

const Subtitle = styled.Text`
	font-size: 16px;
	color: #6c757d;
`;

const FieldsWrapper = styled.View`
	gap: 16px;
`;

const PrimaryButton = styled.TouchableOpacity`
	background-color: #5a6bff;
	height: 56px;
	border-radius: 12px;
	justify-content: center;
	align-items: center;
	shadow-color: #5a6bff;
	shadow-offset: 0px 4px;
	shadow-opacity: 0.3;
	shadow-radius: 8px;
	elevation: 5;
`;

const ButtonText = styled.Text`
	color: #ffffff;
	font-size: 18px;
	font-weight: bold;
	letter-spacing: 0.5px;
`;

const ButtonsRow = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin-top: 16px;
	gap: 12px;
`;

const PrimaryButtonHalf = styled(PrimaryButton)`
	flex: 1;
`;

const SecondaryButton = styled.TouchableOpacity`
	flex: 1;
	height: 56px;
	border-radius: 12px;
	justify-content: center;
	align-items: center;
	background-color: #e9ecef;
`;

const SecondaryButtonText = styled.Text`
	color: #2d3142;
	font-size: 18px;
	font-weight: bold;
`;

const CheckboxContainer = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	margin-top: 8px;
	margin-bottom: 16px;
`;

const CheckboxBox = styled.View<{ checked: boolean }>`
	width: 24px;
	height: 24px;
	border-radius: 6px;
	border-width: 2px;
	border-color: ${({ checked }) => (checked ? "#5a6bff" : "#adb5bd")};
	background-color: ${({ checked }) => (checked ? "#5a6bff" : "transparent")};
	justify-content: center;
	align-items: center;
	margin-right: 12px;
`;

const CheckMark = styled.Text`
	color: #ffffff;
	font-weight: bold;
	font-size: 16px;
	position: absolute;
`;

const CheckboxLabel = styled.Text`
	font-size: 15px;
	color: #2d3142;
	flex: 1;
`;

const HighlightText = styled.Text`
	color: #5a6bff;
	font-weight: bold;
`;
