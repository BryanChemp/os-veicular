import React from "react";
import { Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";
import { Campo } from "../components/Campos";
import { useOrcamentoAtualStore } from "../store/useOrcamentoStore";

const initialCliente = {
	nome: "",
	telefone: "",
	email: "",
	endereco: "",
};

const initialVeiculo = {
	marca: "",
	modelo: "",
	placa: "",
	cor: "",
	ano: "",
};

type CampoCliente = {
	label: string;
	campo: keyof typeof initialCliente;
};

type CampoVeiculo = {
	label: string;
	campo: keyof typeof initialVeiculo;
};

export default function DadosScreen() {
	const { cliente, veiculo, setCliente, setVeiculo } =
		useOrcamentoAtualStore();

	const atualizarCampoCliente = (
		campo: keyof typeof initialCliente,
		valor: string,
	) => {
		setCliente({ ...cliente, [campo]: valor });
	};

	const atualizarCampoVeiculo = (
		campo: keyof typeof initialVeiculo,
		valor: string,
	) => {
		setVeiculo({ ...veiculo, [campo]: valor });
	};

	const camposCliente: CampoCliente[] = [
		{ label: "Nome", campo: "nome" },
		{ label: "Telefone", campo: "telefone" },
		{ label: "E-mail", campo: "email" },
		{ label: "Endereço", campo: "endereco" },
	];

	const camposCarros: CampoVeiculo[] = [
		{ label: "Marca", campo: "marca" },
		{ label: "Modelo", campo: "modelo" },
		{ label: "Placa", campo: "placa" },
		{ label: "Cor", campo: "cor" },
		{ label: "Ano", campo: "ano" },
	];

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<ScrollContainer
				enableOnAndroid={true}
				enableAutomaticScroll={true}
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={Platform.OS === "ios" ? 80 : 20}
				showsVerticalScrollIndicator={false}
			>
				<SectionHeader>
					<Bullet />
					<Title>Dados do Cliente</Title>
				</SectionHeader>

				<FieldsWrapper>
					{camposCliente.map((campo) => (
						<Campo
							key={campo.label}
							label={campo.label}
							value={cliente[campo.campo] || ""}
							onChangeText={(text) =>
								atualizarCampoCliente(campo.campo, text)
							}
						/>
					))}
				</FieldsWrapper>

				<SectionHeader>
					<Bullet />
					<Title>Dados do Veículo</Title>
				</SectionHeader>

				<FieldsWrapper>
					{camposCarros.map((campo) => (
						<Campo
							key={campo.label}
							label={campo.label}
							value={veiculo[campo.campo] || ""}
							onChangeText={(text) =>
								atualizarCampoVeiculo(campo.campo, text)
							}
						/>
					))}
				</FieldsWrapper>
			</ScrollContainer>
		</TouchableWithoutFeedback>
	);
}

const ScrollContainer = styled(KeyboardAwareScrollView).attrs({
	contentContainerStyle: {
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 128,
	},
})`
	flex: 1;
	background-color: #f8f9fa;
`;

const SectionHeader = styled.View`
	flex-direction: row;
	align-items: center;
	margin-top: 32px;
	margin-bottom: 24px;
`;

const Bullet = styled.View`
	width: 6px;
	height: 24px;
	border-radius: 4px;
	background-color: #5a6bff;
	margin-right: 12px;
`;

const Title = styled.Text`
	font-size: 22px;
	font-weight: bold;
	color: #2d3142;
	letter-spacing: 0.3px;
`;

const FieldsWrapper = styled.View`
	margin-bottom: 8px;
	gap: 16px;
`;
