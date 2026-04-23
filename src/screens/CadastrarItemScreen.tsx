import React, { useEffect, useState } from "react";
import {
	Alert,
	ActivityIndicator,
	FlatList,
	Modal,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import { Item, useItemStore } from "../store/useItemStore";
import { Ionicons } from "@expo/vector-icons";
import { currencyToFloat, formatCurrency } from "../utils/mascaras";

export default function CadastrarItemScreen() {
	const { items, loading, fetchItems, addItem, updateItem, deleteItem } =
		useItemStore();

	const [modalVisible, setModalVisible] = useState(false);
	const [tipo, setTipo] = useState<"servico" | "peca">("servico");
	const [descricao, setDescricao] = useState("");
	const [preco, setPreco] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);

	useEffect(() => {
		fetchItems();
	}, []);

	const resetForm = () => {
		setDescricao("");
		setPreco("");
		setTipo("servico");
		setEditingId(null);
		setModalVisible(false);
	};

	const handleSalvar = async () => {
		if (!descricao || !preco) {
			Alert.alert("Atenção", "Preencha todos os campos");
			return;
		}

		const valor = currencyToFloat(preco);

		if (valor <= 0) {
			Alert.alert("Erro", "Preço inválido");
			return;
		}

		try {
			if (editingId) {
				await updateItem(editingId, {
					description: descricao,
					price: valor,
					type: tipo,
				});
			} else {
				await addItem({
					description: descricao,
					price: valor,
					type: tipo,
				});
			}
			resetForm();
		} catch (error) {
			Alert.alert("Erro", "Não foi possível salvar.");
		}
	};

	const handleEditar = (item: Item) => {
		setDescricao(item.description);
		setPreco(formatCurrency((item.price * 100).toString()));
		setTipo(item.type);
		setEditingId(item.id);
		setModalVisible(true);
	};

	return (
		<Container>
			<Header>
				<Title>Itens e Serviços</Title>
				<Subtitle>{items.length} itens cadastrados</Subtitle>
			</Header>

			{loading && items.length === 0 ? (
				<LoadingContainer>
					<ActivityIndicator size="large" color="#5a6bff" />
				</LoadingContainer>
			) : (
				<FlatList
					data={items}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingBottom: 100 }}
					renderItem={({ item }) => (
						<ItemCard onPress={() => handleEditar(item)}>
							<IconBox isService={item.type === "servico"}>
								<Ionicons
									name={
										item.type === "servico"
											? "build-outline"
											: "construct-outline"
									}
									size={20}
									color={
										item.type === "servico"
											? "#5a6bff"
											: "#f59e0b"
									}
								/>
							</IconBox>
							<ItemInfo>
								<ItemTitle>{item.description}</ItemTitle>
								<ItemSub>
									{item.type === "servico"
										? "Serviço"
										: "Peça"}
								</ItemSub>
							</ItemInfo>
							<PriceText>R$ {item.price.toFixed(2)}</PriceText>
						</ItemCard>
					)}
					ListEmptyComponent={
						<EmptyState>
							<Ionicons
								name="archive-outline"
								size={48}
								color="#ccc"
							/>
							<EmptyText>Nenhum item encontrado</EmptyText>
						</EmptyState>
					}
				/>
			)}

			<FabButton
				onPress={() => {
					resetForm();
					setModalVisible(true);
				}}
			>
				<Ionicons name="add" size={30} color="#fff" />
			</FabButton>

			<Modal visible={modalVisible} animationType="slide" transparent>
				<ModalOverlay>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={{ width: "100%" }}
					>
						<ModalContent>
							<ModalHeader>
								<ModalTitle>
									{editingId ? "Editar Item" : "Novo Item"}
								</ModalTitle>
								<TouchableOpacity onPress={resetForm}>
									<Ionicons
										name="close"
										size={24}
										color="#2d3142"
									/>
								</TouchableOpacity>
							</ModalHeader>

							<TipoContainer>
								<TipoButton
									active={tipo === "servico"}
									onPress={() => setTipo("servico")}
								>
									<TipoText active={tipo === "servico"}>
										Serviço
									</TipoText>
								</TipoButton>
								<TipoButton
									active={tipo === "peca"}
									onPress={() => setTipo("peca")}
								>
									<TipoText active={tipo === "peca"}>
										Peça
									</TipoText>
								</TipoButton>
							</TipoContainer>

							<Input
								placeholder="Ex: Pastilha de Freio"
								value={descricao}
								onChangeText={setDescricao}
							/>
							<Input
								placeholder="R$ 0,00"
								value={preco}
								onChangeText={(txt: string) => setPreco(formatCurrency(txt))}
								keyboardType="numeric"
							/>

							<Button onPress={handleSalvar}>
								<ButtonText>
									{editingId ? "Atualizar" : "Salvar"}
								</ButtonText>
							</Button>

							{editingId && (
								<DeleteButton
									onPress={() => {
										Alert.alert(
											"Excluir",
											"Deseja apagar este item?",
											[
												{ text: "Não" },
												{
													text: "Sim",
													onPress: () => {
														deleteItem(editingId);
														resetForm();
													},
												},
											],
										);
									}}
								>
									<DeleteText>Remover Item</DeleteText>
								</DeleteButton>
							)}
						</ModalContent>
					</KeyboardAvoidingView>
				</ModalOverlay>
			</Modal>
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

const ItemCard = styled.TouchableOpacity`
	background-color: #fff;
	margin: 8px 16px;
	padding: 16px;
	border-radius: 16px;
	flex-direction: row;
	align-items: center;
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
`;

const IconBox = styled.View<{ isService: boolean }>`
	width: 44px;
	height: 44px;
	border-radius: 12px;
	background-color: ${({ isService }) => (isService ? "#eef0ff" : "#fff7ed")};
	justify-content: center;
	align-items: center;
	margin-right: 12px;
`;

const ItemInfo = styled.View`
	flex: 1;
`;

const ItemTitle = styled.Text`
	font-size: 16px;
	font-weight: 600;
	color: #2d3142;
`;

const ItemSub = styled.Text`
	font-size: 12px;
	color: #8e94a3;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const PriceText = styled.Text`
	font-size: 16px;
	font-weight: 700;
	color: #10b981;
`;

const FabButton = styled.TouchableOpacity`
	position: absolute;
	right: 32px;
	bottom: 64px;
	width: 64px;
	height: 64px;
	border-radius: 32px;
	background-color: #5a6bff;
	justify-content: center;
	align-items: center;
	elevation: 5;
	shadow-color: #5a6bff;
	shadow-opacity: 0.3;
	shadow-radius: 10px;
`;

const ModalOverlay = styled.View`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.5);
	justify-content: flex-end;
`;

const ModalContent = styled.View`
	background-color: #fff;
	border-top-left-radius: 24px;
	border-top-right-radius: 24px;
	padding: 24px;
	padding-bottom: 40px;
`;

const ModalHeader = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
`;

const ModalTitle = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: #2d3142;
`;

const EmptyState = styled.View`
	align-items: center;
	margin-top: 100px;
`;

const EmptyText = styled.Text`
	color: #8e94a3;
	margin-top: 12px;
`;

const Input = styled.TextInput`
	height: 56px;
	background-color: #f8f9fa;
	border-radius: 12px;
	padding: 0 16px;
	margin-bottom: 16px;
	font-size: 16px;
`;

const Button = styled.TouchableOpacity`
	height: 56px;
	background-color: #5a6bff;
	border-radius: 12px;
	justify-content: center;
	align-items: center;
	margin-top: 8px;
`;

const ButtonText = styled.Text`
	color: #fff;
	font-weight: bold;
	font-size: 16px;
`;

const TipoContainer = styled.View`
	flex-direction: row;
	gap: 10px;
	margin-bottom: 20px;
`;

const TipoButton = styled.TouchableOpacity<{ active: boolean }>`
	flex: 1;
	padding: 12px;
	border-radius: 10px;
	border-width: 1.5px;
	border-color: ${({ active }) => (active ? "#5a6bff" : "#e9ecef")};
	background-color: ${({ active }) => (active ? "#f0f2ff" : "transparent")};
	align-items: center;
`;

const TipoText = styled.Text<{ active: boolean }>`
	color: ${({ active }) => (active ? "#5a6bff" : "#8e94a3")};
	font-weight: bold;
`;

const DeleteButton = styled.TouchableOpacity`
	margin-top: 16px;
	align-items: center;
`;

const DeleteText = styled.Text`
	color: #ef4444;
	font-weight: 600;
`;

const LoadingContainer = styled.View`
	flex: 1;
	justify-content: center;
`;
