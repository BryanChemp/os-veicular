import React, { useContext, useState, useCallback, useEffect } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	ScrollView,
	Alert,
	ActivityIndicator,
	Platform,
} from "react-native";
import styled from "styled-components/native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { useNavigation } from "@react-navigation/native";
import { OrcamentoContext } from "../context/ContextOrcamento";

export default function FinalizarScreen() {
	const contextOrcamento = useContext(OrcamentoContext);
	const [pdfUri, setPdfUri] = useState<string | null>(null);
	const [logoBase, setLogoBase] = useState<string | null>(null);
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
		converterImage64();
		return () => {
			limparPDF();
		};
	}, []);

	const converterImage64 = async () => {
		try {
			const asset = Asset.fromModule(require("../assets/logo.jpeg"));
			await asset.downloadAsync();
			if (!asset.localUri) return;

			const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
				encoding: FileSystem.EncodingType.Base64,
			});

			setLogoBase(`data:image/jpeg;base64,${base64}`);
		} catch (error) {
			console.error("Erro ao converter imagem:", error);
		}
	};

	const calcularTotalServicos = () =>
		contextOrcamento?.servicos.reduce((acc, item) => acc + item.valor, 0) ||
		0;
	const calcularTotalPecas = () =>
		contextOrcamento?.pecas.reduce((acc, item) => acc + item.valor, 0) || 0;
	const calcularTotalGeral = () =>
		calcularTotalServicos() + calcularTotalPecas();

	const gerarHTML = () => {
		if (!contextOrcamento) return "";
		const totalServicos = calcularTotalServicos();
		const totalPecas = calcularTotalPecas();
		const totalGeral = calcularTotalGeral();

		return `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; margin: 40px; color: #333; }
            .header { display: flex; align-items: center; border-bottom: 2px solid #5A6BFF; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { max-width: 100px; margin-right: 20px; border-radius: 8px; }
            .company-info h1 { font-size: 22px; margin: 0; color: #2D3142; }
            .company-info p { margin: 2px 0; font-size: 13px; color: #666; }
            .section { margin-bottom: 30px; }
            .section h2 { font-size: 18px; color: #5A6BFF; border-bottom: 1px solid #E2E4EF; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item { font-size: 14px; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #F8F9FF; color: #5A6BFF; text-align: left; padding: 12px; font-size: 13px; border-bottom: 2px solid #E2E4EF; }
            td { padding: 12px; border-bottom: 1px solid #EEE; font-size: 14px; }
            .subtotal { text-align: right; margin-top: 15px; font-weight: bold; color: #2D3142; font-size: 15px; }
            .total-geral { margin-top: 40px; padding: 25px; background-color: #F8F9FF; border-radius: 12px; border: 2px solid #5A6BFF; text-align: right; }
            .total-geral p { margin: 0; font-size: 22px; font-weight: 800; color: #2D3142; }
          </style>
        </head>
        <body>
          <div class="header">
            ${logoBase ? `<img src="${logoBase}" class="logo" />` : ""}
            <div class="company-info">
              <h1>Forte Rocha Funilaria e Pintura</h1>
              <p>Avenida Rio de Janeiro, 978 | CNPJ: 11.922.593/0001-60</p>
              <p>(44) 3274-3849 / (44) 99860-6210</p>
            </div>
          </div>
          <div class="section">
            <h2>Dados do Cliente</h2>
            <div class="info-grid">
              <div class="info-item"><strong>Nome:</strong> ${contextOrcamento.cliente.nome}</div>
              <div class="info-item"><strong>Telefone:</strong> ${contextOrcamento.cliente.telefone}</div>
              <div class="info-item"><strong>Email:</strong> ${contextOrcamento.cliente.email}</div>
            </div>
          </div>
          <div class="section">
            <h2>Veículo</h2>
            <div class="info-grid">
              <div class="info-item"><strong>Modelo:</strong> ${contextOrcamento.veiculo.modelo}</div>
              <div class="info-item"><strong>Placa:</strong> ${contextOrcamento.veiculo.placa}</div>
              <div class="info-item"><strong>Cor:</strong> ${contextOrcamento.veiculo.cor}</div>
              <div class="info-item"><strong>Ano:</strong> ${contextOrcamento.veiculo.ano}</div>
            </div>
          </div>
          <div class="section">
            <h2>Itens do Orçamento</h2>
            <table>
              <thead><tr><th>Descrição</th><th style="text-align: right;">Valor</th></tr></thead>
              <tbody>
                ${contextOrcamento.servicos.map((s) => `<tr><td>${s.descricao} (Serviço)</td><td style="text-align: right;">R$ ${s.valor.toFixed(2).replace(".", ",")}</td></tr>`).join("")}
                ${contextOrcamento.pecas.map((p) => `<tr><td>${p.descricao} (Peça)</td><td style="text-align: right;">R$ ${p.valor.toFixed(2).replace(".", ",")}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
          <div class="total-geral">
            <p>TOTAL GERAL: R$ ${totalGeral.toFixed(2).replace(".", ",")}</p>
          </div>
        </body>
      </html>
    `;
	};

	const gerarPDF = async () => {
		if (isGenerating) return;
		try {
			setIsGenerating(true);
			const html = gerarHTML();
			const { uri } = await Print.printToFileAsync({ html });
			setPdfUri(uri);
			Alert.alert("Sucesso", "PDF gerado com sucesso!");
		} catch (erro) {
			Alert.alert("Erro", "Não foi possível gerar o PDF.");
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
			contextOrcamento?.resetarDados();
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

	if (!contextOrcamento)
		return (
			<Container>
				<ActivityIndicator size="large" color="#5A6BFF" />
			</Container>
		);

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
						<InfoText>{contextOrcamento.cliente.nome}</InfoText>
						<InfoText>{contextOrcamento.cliente.telefone}</InfoText>
					</InfoGroup>

					<InfoGroup>
						<SectionLabel>Veículo</SectionLabel>
						<InfoText>
							{contextOrcamento.veiculo.marca}{" "}
							{contextOrcamento.veiculo.modelo}
						</InfoText>
						<InfoText>
							Placa: {contextOrcamento.veiculo.placa}
						</InfoText>
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
