import React, { useContext, useEffect } from "react";
import { Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Campo } from "../components/Campos";
import {
	Cliente,
	OrcamentoContext,
	Veiculo,
} from "../context/ContextOrcamento";

type CampoCliente = {
	label: string;
	campo: keyof Cliente;
};

type CampoVeiculo = {
	label: string;
	campo: keyof Veiculo;
};

export default function DadosScreen() {
	const contextOrcamento = useContext(OrcamentoContext);

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

	const atualizarCliente = (campo: string, valor: string) => {
		if (contextOrcamento) {
			contextOrcamento.setCliente({
				...contextOrcamento.cliente,
				[campo]: valor,
			});
		}
	};

	const atualizarVeiculo = (campo: string, valor: string) => {
		if (contextOrcamento) {
			contextOrcamento.setVeiculo({
				...contextOrcamento.veiculo,
				[campo]: valor,
			});
		}
	};

	useEffect(() => {
		const salvarDados = async () => {
			try {
				await AsyncStorage.setItem(
					"@dadosOrcamento",
					JSON.stringify({
						cliente: contextOrcamento?.cliente,
						veiculo: contextOrcamento?.veiculo,
					}),
				);
			} catch (error) {
				console.log("Erro ao salvar", error);
			}
		};

		if (contextOrcamento?.cliente && contextOrcamento?.veiculo) {
			salvarDados();
		}
	}, [contextOrcamento?.cliente, contextOrcamento?.veiculo]);

	useEffect(() => {
		const carregarDados = async () => {
			try {
				const dadosInseridos =
					await AsyncStorage.getItem("@dadosOrcamento");
				if (dadosInseridos) {
					const { cliente, veiculo } = JSON.parse(dadosInseridos) as {
						cliente: Cliente;
						veiculo: Veiculo;
					};

					if (contextOrcamento) {
						contextOrcamento.setCliente(cliente);
						contextOrcamento.setVeiculo(veiculo);
					}
				}
			} catch (error) {
				console.log("Erro ao carregar dados", error);
			}
		};
		carregarDados();
	}, []);

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
							value={contextOrcamento?.cliente[campo.campo] || ""}
							onChangeText={(text) =>
								atualizarCliente(campo.campo, text)
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
							value={contextOrcamento?.veiculo[campo.campo] || ""}
							onChangeText={(text) =>
								atualizarVeiculo(campo.campo, text)
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
	background-color: #F8F9FA;
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
