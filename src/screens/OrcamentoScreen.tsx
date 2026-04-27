import React, { useState } from "react";
import { ScrollView, Modal, Platform } from "react-native";
import styled from "styled-components/native";
import { ModalFormulario } from "../components/ModalFormulario";
import { ItemOrcamento } from "../components/ItemOrcamento";
import { useOrcamentoAtualStore } from "../store/useOrcamentoStore";

export default function OrcamentoScreen() {
	const servicos = useOrcamentoAtualStore((state) => state.servicos);
	const pecas = useOrcamentoAtualStore((state) => state.pecas);
	const addServico = useOrcamentoAtualStore((state) => state.addServico);
	const addPeca = useOrcamentoAtualStore((state) => state.addPeca);

	const [modalVisivel, setModalVisivel] = useState(false);
	const [modalOpcoesVisivel, setModalOpcoesVisivel] = useState(false);
	const [tipoFormulario, setTipoFormulario] = useState<"servico" | "peca">(
		"servico",
	);

	const [descricao, setDescricao] = useState("");
	const [valor, setValor] = useState("");

	const adicionarItem = () => {
		const valorNumerico = parseFloat(valor.replace(",", ".")) || 0;

		const novoItem = {
			descricao,
			valor: valorNumerico,
		};

		if (tipoFormulario === "servico") {
			addServico(novoItem);
		} else {
			addPeca(novoItem);
		}

		fecharModalFormulario();
	};

	const fecharModalFormulario = () => {
		setDescricao("");
		setValor("");
		setModalVisivel(false);
	};

	const valorTotal = () => {
		const totalServicos = servicos.reduce((acc, i) => acc + i.valor, 0);
		const totalPecas = pecas.reduce((acc, i) => acc + i.valor, 0);
		return totalServicos + totalPecas;
	};

	const renderSecao = (
		titulo: string,
		dados: any[],
		tipo: "servico" | "peca",
	) => (
		<>
			<SectionHeader>
				<Bullet />
				<SectionTitle>{titulo}</SectionTitle>
			</SectionHeader>

			<TableHeader>
				<HeaderLabel flex={6}>Descrição</HeaderLabel>
				<HeaderLabel flex={3} align="right">
					Valor
				</HeaderLabel>
			</TableHeader>

			{dados.length > 0 ? (
				dados.map((item, index) => (
					<ItemOrcamento
						key={`${tipo}-${index}`}
						descricao={item.descricao}
						valor={item.valor}
						tipo={tipo}
						onDelete={() =>
							tipo === "servico"
								? useOrcamentoAtualStore
										.getState()
										.removeServico(index)
								: useOrcamentoAtualStore
										.getState()
										.removePeca(index)
						}
					/>
				))
			) : (
				<EmptyText>Nenhum item adicionado</EmptyText>
			)}
		</>
	);

	return (
		<Container>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: 24,
					paddingTop: 16,
					paddingBottom: 32,
				}}
			>
				{renderSecao("Serviços", servicos, "servico")}
				{renderSecao("Peças", pecas, "peca")}
			</ScrollView>

			<FooterContainer>
				<TotalWrapper>
					<TotalLabel>Valor Total</TotalLabel>
					<TotalCard>
						<TotalValueText>
							R${" "}
							{valorTotal().toLocaleString("pt-BR", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</TotalValueText>
					</TotalCard>
				</TotalWrapper>
			</FooterContainer>

			<FabButton onPress={() => setModalOpcoesVisivel(true)}>
				<FabText>+</FabText>
			</FabButton>

			<Modal
				visible={modalOpcoesVisivel}
				transparent
				animationType="fade"
			>
				<ModalOverlay>
					<ModalContent>
						<ModalHeader>
							<ModalTitle>O que deseja adicionar?</ModalTitle>
						</ModalHeader>

						<OptionButton
							onPress={() => {
								setTipoFormulario("servico");
								setDescricao("");
								setValor("");
								setModalOpcoesVisivel(false);
								setModalVisivel(true);
							}}
						>
							<OptionButtonText>Novo Serviço</OptionButtonText>
						</OptionButton>

						<OptionButton
							secondary
							onPress={() => {
								setTipoFormulario("peca");
								setDescricao("");
								setValor("");
								setModalOpcoesVisivel(false);
								setModalVisivel(true);
							}}
						>
							<OptionButtonText secondary>
								Nova Peça
							</OptionButtonText>
						</OptionButton>

						<CancelButton
							onPress={() => setModalOpcoesVisivel(false)}
						>
							<CancelButtonText>Cancelar</CancelButtonText>
						</CancelButton>
					</ModalContent>
				</ModalOverlay>
			</Modal>

			<ModalFormulario
				visivel={modalVisivel}
				titulo={
					tipoFormulario === "servico"
						? "Adicionar Serviço"
						: "Adicionar Peça"
				}
				descricao={descricao}
				valor={valor}
				setDescricao={setDescricao}
				setValor={setValor}
				salvar={adicionarItem}
				fechar={fecharModalFormulario}
				tipo={tipoFormulario}
			/>
		</Container>
	);
}

const Container = styled.View`
	flex: 1;
	background-color: #f8f9fa;
`;

const SectionHeader = styled.View`
	flex-direction: row;
	align-items: center;
	margin-top: 24px;
	margin-bottom: 16px;
`;

const Bullet = styled.View`
	width: 6px;
	height: 24px;
	border-radius: 4px;
	background-color: #5a6bff;
	margin-right: 12px;
`;

const SectionTitle = styled.Text`
	font-size: 22px;
	font-weight: bold;
	color: #2d3142;
`;

const TableHeader = styled.View`
	flex-direction: row;
	padding: 0 8px;
	margin-bottom: 12px;
`;

const HeaderLabel = styled.Text<{ flex: number; align?: string }>`
	flex: ${(props) => props.flex};
	font-weight: 700;
	color: #5a6bff;
	font-size: 14px;
	text-transform: uppercase;
	letter-spacing: 1px;
	text-align: ${(props) => props.align || "left"};
`;

const EmptyText = styled.Text`
	color: #a0a4b8;
	font-style: italic;
	margin-left: 8px;
	margin-bottom: 16px;
`;

const FooterContainer = styled.View`
	background-color: #ffffff;
	padding: 20px 24px;
	border-top-left-radius: 24px;
	border-top-right-radius: 24px;

	${Platform.OS === "ios"
		? `
    shadow-color: #000;
    shadow-offset: 0px -4px;
    shadow-opacity: 0.05;
    shadow-radius: 10px;
  `
		: "elevation: 10;"}
`;

const TotalWrapper = styled.View`
	margin-bottom: 32px;
`;

const TotalLabel = styled.Text`
	font-size: 14px;
	font-weight: 600;
	color: #5a6bff;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

const TotalCard = styled.View`
	width: 100%;
	padding: 16px;
	border-radius: 16px;
	justify-content: center;
	align-items: flex-start;
`;

const TotalValueText = styled.Text`
	font-size: 24px;
	font-weight: 800;
	color: #2d3142;
	width: 100%;
	text-align: right;
`;

const FabButton = styled.TouchableOpacity`
	width: 60px;
	height: 60px;
	border-radius: 30px;
	background-color: #5a6bff;
	justify-content: center;
	align-items: center;
	position: absolute;
	bottom: 128px;
	right: 32px;
	elevation: 8;
	shadow-color: #5a6bff;
	shadow-offset: 0px 4px;
	shadow-opacity: 0.3;
	shadow-radius: 6px;
`;

const FabText = styled.Text`
	color: #ffffff;
	font-size: 32px;
	font-weight: 300;
`;

const ModalOverlay = styled.View`
	flex: 1;
	background-color: rgba(45, 49, 66, 0.7);
	justify-content: flex-end;
`;

const ModalContent = styled.View`
	background-color: #ffffff;
	border-top-left-radius: 32px;
	border-top-right-radius: 32px;
	padding: 32px 24px;
	padding-bottom: ${Platform.OS === "ios" ? "40px" : "32px"};
`;

const ModalHeader = styled.View`
	margin-bottom: 24px;
`;

const ModalTitle = styled.Text`
	font-size: 20px;
	font-weight: 700;
	color: #2d3142;
	text-align: center;
`;

const OptionButton = styled.TouchableOpacity<{ secondary?: boolean }>`
	width: 100%;
	height: 56px;
	background-color: ${(props) => (props.secondary ? "#FFFFFF" : "#5A6BFF")};
	border-radius: 14px;
	justify-content: center;
	align-items: center;
	margin-bottom: 12px;
	border-width: ${(props) => (props.secondary ? "1.5px" : "0px")};
	border-color: #5a6bff;
`;

const OptionButtonText = styled.Text<{ secondary?: boolean }>`
	font-weight: 700;
	color: ${(props) => (props.secondary ? "#5A6BFF" : "#FFFFFF")};
	font-size: 16px;
`;

const CancelButton = styled.TouchableOpacity`
	margin-top: 8px;
	padding: 12px;
`;

const CancelButtonText = styled.Text`
	color: #a0a4b8;
	font-size: 16px;
	font-weight: 600;
	text-align: center;
`;
