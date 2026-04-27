import React, { useState, useCallback, useEffect } from "react";
import { Alert, ActivityIndicator, Platform } from "react-native";
import styled from "styled-components/native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";

import { useOrcamentoAtualStore } from "../store/useOrcamentoStore";
import { useOrcamentoPDF } from "../hooks/useOrcamentoPDF";
import { useOrcamentosFinalizadosStore } from "../store/useOrcamentosFinalizados";
import { getLogoBase64 } from "../utils/getLogoBase64";

export default function FinalizarScreen() {
	const { cliente, veiculo, resetar } = useOrcamentoAtualStore();
	const { adicionar } = useOrcamentosFinalizadosStore();
	const {
		gerarHTML,
		calcularTotalServicos,
		calcularTotalPecas,
		calcularTotalGeral,
	} = useOrcamentoPDF();

	const [logo64, setLogo64] = useState<string | null>(null);
	const [pdfUri, setPdfUri] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isSharing, setIsSharing] = useState(false);
	const navigation = useNavigation<any>();

	const limparPDF = useCallback(async () => {
		if (pdfUri) {
			try {
				await FileSystem.deleteAsync(pdfUri, { idempotent: true });
			} catch (error) {
				console.error("Erro ao limpar PDF:", error);
			}
			setPdfUri(null);
		}
	}, [pdfUri]);

	useEffect(() => {
		const fetchLogoBase64 = async () => {
			const logoBase = await getLogoBase64();
			setLogo64(logoBase);
		};

		fetchLogoBase64();

		return () => {
			limparPDF();
		};
	}, []);

	const gerarPDF = async () => {
		if (isGenerating) return;

		try {
			setIsGenerating(true);

			const html = await gerarHTML(logo64);
			const { uri } = await Print.printToFileAsync({ html });

			setPdfUri(uri);

			const state = useOrcamentoAtualStore.getState();

			adicionar({
				id: Date.now().toString(),
				cliente: state.cliente,
				veiculo: state.veiculo,
				servicos: state.servicos,
				pecas: state.pecas,
				total: calcularTotalGeral(),
				pdfUri: uri,
				createdAt: Date.now(),
			});

			Alert.alert("Sucesso", "PDF gerado e salvo!");
		} catch (error: any) {
			console.error("error", error);
			Alert.alert(
				"Erro",
				"Não foi possível gerar o PDF: " + error.message,
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const compartilharPDF = async () => {
		if (!pdfUri || isSharing) return;
		try {
			setIsSharing(true);
			await Sharing.shareAsync(pdfUri);
			await limparPDF();
			resetar();

			navigation.navigate("Main", {
				screen: "Home",
			});
		} catch (erro) {
			if (!(erro instanceof Error && erro.message.includes("canceled"))) {
				Alert.alert("Erro", "Não foi possível compartilhar.");
			}
		} finally {
			setIsSharing(false);
		}
	};

	return (
		<Container>
			<HeaderSection>
				<Bullet />
				<Title>Resumo do Orçamento</Title>
			</HeaderSection>

			<SummaryScrollView showsVerticalScrollIndicator={false}>
				<SummaryCard>
					<InfoGroup>
						<SectionLabel>Cliente</SectionLabel>
						<InfoText>{cliente.nome}</InfoText>
						<InfoText>{cliente.telefone}</InfoText>
					</InfoGroup>

					<InfoGroup>
						<SectionLabel>Veículo</SectionLabel>
						<InfoText>
							{veiculo.marca} {veiculo.modelo}
						</InfoText>
						<InfoText>Placa: {veiculo.placa}</InfoText>
					</InfoGroup>

					<Divider />

					<ValuesRow>
						<ValueLabel>Serviços</ValueLabel>
						<ValueAmount>
							R${" "}
							{calcularTotalServicos()
								.toFixed(2)
								.replace(".", ",")}
						</ValueAmount>
					</ValuesRow>

					<ValuesRow>
						<ValueLabel>Peças</ValueLabel>
						<ValueAmount>
							R${" "}
							{calcularTotalPecas().toFixed(2).replace(".", ",")}
						</ValueAmount>
					</ValuesRow>

					<TotalContainer>
						<TotalLabel>Valor Final</TotalLabel>
						<TotalAmount>
							R${" "}
							{calcularTotalGeral().toFixed(2).replace(".", ",")}
						</TotalAmount>
					</TotalContainer>
				</SummaryCard>
			</SummaryScrollView>

			<FixedFooter>
				{!pdfUri ? (
					<PrimaryButton onPress={gerarPDF} disabled={isGenerating}>
						{isGenerating ? (
							<ActivityIndicator color="#FFF" />
						) : (
							<ButtonText>Gerar Documento PDF</ButtonText>
						)}
					</PrimaryButton>
				) : (
					<SecondaryButton
						onPress={compartilharPDF}
						disabled={isSharing}
					>
						{isSharing ? (
							<ActivityIndicator color="#5A6BFF" />
						) : (
							<SecondaryButtonText>
								Compartilhar e Salvar
							</SecondaryButtonText>
						)}
					</SecondaryButton>
				)}
			</FixedFooter>
		</Container>
	);
}

const Container = styled.View`
	flex: 1;
	background-color: #f8f9fa;
	padding-top: 16px;
`;

const HeaderSection = styled.View`
	flex-direction: row;
	align-items: center;
	padding: 20px 24px;
	background-color: #f8f9fa;
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
`;

const SummaryScrollView = styled.ScrollView`
	flex: 1;
	padding: 0 24px;
`;

const SummaryCard = styled.View`
	background-color: #ffffff;
	border-radius: 20px;
	padding: 24px;
	margin-bottom: 24px;
	border-width: 1px;
	border-color: #e2e4ef;
	${Platform.OS === "ios"
		? `
    shadow-color: #000;
    shadow-offset: 0px 4px;
    shadow-opacity: 0.05;
    shadow-radius: 10px;
  `
		: "elevation: 3;"}
`;
const InfoGroup = styled.View`
	margin-bottom: 16px;
`;

const SectionLabel = styled.Text`
	font-size: 12px;
	font-weight: 700;
	color: #a0a4b8;
	text-transform: uppercase;
	letter-spacing: 1px;
	margin-bottom: 4px;
`;

const InfoText = styled.Text`
	font-size: 16px;
	color: #2d3142;
	font-weight: 500;
`;

const Divider = styled.View`
	height: 1px;
	background-color: #e2e4ef;
	margin: 10px 0 20px 0;
`;

const ValuesRow = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 8px;
`;

const ValueLabel = styled.Text`
	font-size: 14px;
	color: #666;
`;

const ValueAmount = styled.Text`
	font-size: 14px;
	font-weight: 600;
	color: #2d3142;
`;

const TotalContainer = styled.View`
	margin-top: 16px;
	padding-top: 16px;
	border-top-width: 2px;
	border-top-color: #f8f9ff;
	align-items: flex-end;
`;

const TotalLabel = styled.Text`
	font-size: 14px;
	color: #5a6bff;
	font-weight: 600;
`;

const TotalAmount = styled.Text`
	font-size: 24px;
	font-weight: 800;
	color: #2d3142;
`;

const FixedFooter = styled.View`
	padding: 24px;
	background-color: #ffffff;
	border-top-left-radius: 24px;
	border-top-right-radius: 24px;
	padding-bottom: 64px;
	${Platform.OS === "ios"
		? `
    shadow-color: #000;
    shadow-offset: 0px -4px;
    shadow-opacity: 0.05;
    shadow-radius: 10px;
  `
		: "elevation: 10;"}
`;

const PrimaryButton = styled.TouchableOpacity`
	height: 56px;
	background-color: #5a6bff;
	border-radius: 16px;
	justify-content: center;
	align-items: center;
	opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const SecondaryButton = styled.TouchableOpacity`
	height: 56px;
	background-color: #f0f2ff;
	border-radius: 16px;
	justify-content: center;
	align-items: center;
	border-width: 1.5px;
	border-color: #5a6bff;
`;

const ButtonText = styled.Text`
	color: #ffffff;
	font-size: 16px;
	font-weight: 700;
	letter-spacing: 0.5px;
`;

const SecondaryButtonText = styled.Text`
	color: #5a6bff;
	font-size: 16px;
	font-weight: 700;
`;
