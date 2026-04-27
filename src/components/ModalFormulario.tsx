import React, { useEffect, useState } from "react";
import { Modal, Platform, ScrollView } from "react-native";
import styled from "styled-components/native";
import { Dropdown } from "./Dropdown";
import { useItemStore } from "../store/useItemStore";

type ModalFormularioProps = {
	visivel: boolean;
	titulo: string;
	descricao: string;
	valor: string;
	setDescricao: (text: string) => void;
	setValor: (text: string) => void;
	salvar: () => void;
	fechar: () => void;
	tipo: "servico" | "peca";
};

export const ModalFormulario = ({
	visivel,
	titulo,
	descricao,
	valor,
	setDescricao,
	setValor,
	salvar,
	fechar,
	tipo,
}: ModalFormularioProps) => {
	const items = useItemStore((state) => state.items);
	const itensFiltrados = items.filter((i) => i.type === tipo);

	const tratarSelecaoDropdown = (valorSelecionado: string) => {
		const itemOriginal = itensFiltrados.find(
			(i) => String(i.price) === valorSelecionado,
		);

		if (itemOriginal) {
			setDescricao(itemOriginal.description);
			setValor(String(itemOriginal.price));
		}
	};

	return (
		<Modal
			visible={visivel}
			transparent
			animationType="fade"
			onRequestClose={fechar}
		>
			<ModalOverlay>
				<ModalContent
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<Header>
						<TitleContainer>
							<Bullet />
							<ModalTitle>{titulo}</ModalTitle>
						</TitleContainer>
						<CloseButton onPress={fechar}>
							<CloseText>×</CloseText>
						</CloseButton>
					</Header>

					<ScrollView
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
					>
						<Dropdown
							label="Itens cadastrados"
							value={valor}
							onValueChange={tratarSelecaoDropdown}
							enableSearch
							options={itensFiltrados.map((item) => ({
								label: `${item.description} - R$ ${item.price.toFixed(2)}`,
								value: String(item.price),
							}))}
						/>

						<SaveButton
							onPress={salvar}
							disabled={
								!(descricao.length > 0 && valor.length > 0)
							}
							style={{
								backgroundColor:
									descricao.length > 0 && valor.length > 0
										? "#5a6bff"
										: "#c5c9ff",
							}}
						>
							<SaveButtonText>
								Adicionar ao orçamento
							</SaveButtonText>
						</SaveButton>

						<BackButton onPress={fechar}>
							<BackButtonText>Voltar</BackButtonText>
						</BackButton>
					</ScrollView>
				</ModalContent>
			</ModalOverlay>
		</Modal>
	);
};

const ModalOverlay = styled.View`
	flex: 1;
	background-color: rgba(45, 49, 66, 0.7);
	justify-content: flex-end;
`;

const ModalContent = styled.KeyboardAvoidingView`
	background-color: #ffffff;
	border-top-left-radius: 32px;
	border-top-right-radius: 32px;
	padding: 24px;
	max-height: 85%;
`;

const Header = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
`;

const TitleContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;

const Bullet = styled.View`
	width: 6px;
	height: 20px;
	background-color: #5a6bff;
	border-radius: 3px;
	margin-right: 10px;
`;

const ModalTitle = styled.Text`
	font-size: 20px;
	font-weight: 800;
	color: #2d3142;
`;

const CloseButton = styled.TouchableOpacity`
	background-color: #f0f2ff;
	width: 32px;
	height: 32px;
	border-radius: 16px;
	justify-content: center;
	align-items: center;
`;

const CloseText = styled.Text`
	font-size: 22px;
	color: #5a6bff;
	line-height: 24px;
`;

const ActionWrapper = styled.View`
	align-items: flex-end;
	margin-top: 8px;
	margin-bottom: 16px;
`;

const NewItemLink = styled.TouchableOpacity`
	padding: 4px 8px;
`;

const SaveButton = styled.TouchableOpacity`
	background-color: #5a6bff;
	height: 56px;
	border-radius: 16px;
	justify-content: center;
	align-items: center;
	margin-top: 10px;
	elevation: 2;
	margin-bottom: 128px;
`;

const SaveButtonText = styled.Text`
	color: #ffffff;
	font-size: 16px;
	font-weight: 700;
`;

const BackButton = styled.TouchableOpacity`
	margin-top: 12px;
	padding: 12px;
	align-items: center;
	margin-bottom: 20px;
`;

const BackButtonText = styled.Text`
	color: #a0a4b8;
	font-size: 14px;
	font-weight: 600;
`;
