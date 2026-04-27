import React from "react";
import { FlatList, Linking, Alert, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { useOrcamentosFinalizadosStore } from "../store/useOrcamentosFinalizados";
import * as Sharing from "expo-sharing";
import { FontAwesome } from "@expo/vector-icons";

export default function ListaOrcamentosFinalizados() {
	const { orcamentos, remover } = useOrcamentosFinalizadosStore();

	const abrirPDF = async (uri: string) => {
		try {
			await Linking.openURL(uri);
		} catch {
			Alert.alert("Erro", "Não foi possível abrir o PDF");
		}
	};

	const compartilharPDF = async (uri: string) => {
		try {
			await Sharing.shareAsync(uri);
		} catch {
			Alert.alert("Erro", "Não foi possível compartilhar");
		}
	};

	const renderItem = ({ item }: any) => (
		<Card>
			<InfoContainer>
				<Cliente>{item.cliente.nome}</Cliente>
				<Veiculo>
					{item.veiculo.marca} {item.veiculo.modelo}
				</Veiculo>
				<Data>
					{new Date(item.createdAt).toLocaleDateString("pt-BR")}
				</Data>
			</InfoContainer>

			<RightContainer>
				<Valor>R$ {item.total.toFixed(2).replace(".", ",")}</Valor>

				<Actions>
					<ActionButton onPress={() => abrirPDF(item.pdfUri)}>
						<FontAwesome
							name="file-pdf-o"
							size={18}
							color="#5a6bff"
						/>
					</ActionButton>

					<ActionButton onPress={() => compartilharPDF(item.pdfUri)}>
						<FontAwesome
							name="share-alt"
							size={18}
							color="#10b981"
						/>
					</ActionButton>

					<ActionButton
						onPress={() =>
							Alert.alert(
								"Remover",
								"Deseja excluir este orçamento?",
								[
									{ text: "Cancelar" },
									{
										text: "Excluir",
										onPress: () => remover(item.id),
									},
								],
							)
						}
					>
						<FontAwesome name="trash" size={18} color="#ef4444" />
					</ActionButton>
				</Actions>
			</RightContainer>
		</Card>
	);

	return (
		<Container>
			<Header>
				<Title>Orçamentos Finalizados</Title>
				<Subtitle>{orcamentos.length} registros</Subtitle>
			</Header>

			{orcamentos.length === 0 ? (
				<EmptyContainer>
					<FontAwesome name="folder-open" size={48} color="#ccc" />
					<EmptyText>Nenhum orçamento salvo</EmptyText>
				</EmptyContainer>
			) : (
				<FlatList
					data={orcamentos}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingBottom: 100 }}
					renderItem={renderItem}
				/>
			)}
		</Container>
	);
}

const Container = styled.View`
	flex: 1;
	background-color: #f4f7fa;
`;

const Header = styled.View`
	background-color: #fff;
	padding-left: 32px;
	padding-top: 16px;
	padding-bottom: 16px;
`;

const Title = styled.Text`
	font-size: 24px;
	font-weight: 800;
	color: #1a1c24;
`;

const Subtitle = styled.Text`
	color: #8e94a3;
	font-size: 14px;
`;

const Card = styled.View`
	background-color: #fff;
	margin: 8px 16px;
	padding: 16px;
	border-radius: 16px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const InfoContainer = styled.View`
	flex: 1;
`;

const Cliente = styled.Text`
	font-size: 16px;
	font-weight: 700;
	color: #2d3142;
`;

const Veiculo = styled.Text`
	font-size: 14px;
	color: #666;
	margin-top: 2px;
`;

const Data = styled.Text`
	font-size: 12px;
	color: #a0a4b8;
	margin-top: 4px;
`;

const RightContainer = styled.View`
	align-items: flex-end;
`;

const Valor = styled.Text`
	font-size: 16px;
	font-weight: 700;
	color: #10b981;
	margin-bottom: 8px;
`;

const Actions = styled.View`
	flex-direction: row;
	gap: 12px;
`;

const ActionButton = styled.TouchableOpacity`
	padding: 6px;
`;

const EmptyContainer = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;

const EmptyText = styled.Text`
	margin-top: 12px;
	color: #8e94a3;
`;
