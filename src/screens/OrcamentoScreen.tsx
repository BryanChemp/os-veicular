import React, { useEffect, useState, useContext } from "react";
import {
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { OrcamentoContext } from "../context/ContextOrcamento";
import { ModalFormulario } from "../components/ModalFormulario";
import { ItemOrcamento } from "../components/ItemOrcamento";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DadosOrcamento {
  servicos: { descricao: string; valor: number }[];
  pecas: { descricao: string; valor: number }[];
}

export default function OrcamentoScreen() {
  const orcamentoContext = useContext(OrcamentoContext);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalOpcoesVisivel, setModalOpcoesVisivel] = useState(false);
  const [tipoFormulario, setTipoFormulario] = useState<"servico" | "peca" | null>(null);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  useEffect(() => {
    const salvarDados = async () => {
      try {
        await AsyncStorage.setItem(
          "@dadosOrcamentoItens",
          JSON.stringify({
            servicos: orcamentoContext?.servicos,
            pecas: orcamentoContext?.pecas,
          })
        );
      } catch (error) {
        console.log("Erro ao salvar", error);
      }
    };
    salvarDados();
  }, [orcamentoContext?.servicos, orcamentoContext?.pecas]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await AsyncStorage.getItem("@dadosOrcamentoItens");
        if (dados) {
          const { servicos: s, pecas: p } = JSON.parse(dados) as DadosOrcamento;
          orcamentoContext?.setServicos(s || []);
          orcamentoContext?.setPecas(p || []);
        }
      } catch (error) {
        console.log("Erro ao carregar:", error);
      }
    };
    carregarDados();
  }, []);

  const adicionarItem = () => {
    const valorNumerico = parseFloat(valor.replace(",", ".")) || 0;
    const novoItem = { descricao, valor: valorNumerico };

    if (tipoFormulario === "servico") {
      orcamentoContext?.setServicos([...orcamentoContext.servicos, novoItem]);
    } else if (tipoFormulario === "peca") {
      orcamentoContext?.setPecas([...orcamentoContext.pecas, novoItem]);
    }

    setDescricao("");
    setValor("");
    setModalVisivel(false);
  };

  const valorTotal = () => {
    const totalPecas = orcamentoContext?.pecas.reduce((acc, item) => acc + item.valor, 0) || 0;
    const totalServico = orcamentoContext?.servicos.reduce((acc, item) => acc + item.valor, 0) || 0;
    return totalPecas + totalServico;
  };

  const renderSecao = (titulo: string, dados: any[], tipo: "servico" | "peca") => (
    <>
      <SectionHeader>
        <Bullet />
        <SectionTitle>{titulo}</SectionTitle>
      </SectionHeader>
      
      <TableHeader>
        <HeaderLabel flex={6}>Descrição</HeaderLabel>
        <HeaderLabel flex={3} align="right">Valor</HeaderLabel>
      </TableHeader>

      {dados.length > 0 ? (
        dados.map((item, index) => (
          <ItemOrcamento
            key={index}
            descricao={item.descricao}
            valor={item.valor}
            tipo={tipo}
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
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
      >
        {renderSecao("Serviços", orcamentoContext?.servicos || [], "servico")}
        {renderSecao("Peças", orcamentoContext?.pecas || [], "peca")}
      </ScrollView>

      <FooterContainer>
        <TotalWrapper>
          <TotalLabel>Valor Total</TotalLabel>
          <TotalCard>
            <TotalValueText>
              R$ {valorTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </TotalValueText>
          </TotalCard>
        </TotalWrapper>
      </FooterContainer>

      <FabButton onPress={() => setModalOpcoesVisivel(true)}>
        <FabText>+</FabText>
      </FabButton>

      <Modal visible={modalOpcoesVisivel} transparent animationType="fade">
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>O que deseja adicionar?</ModalTitle>
            </ModalHeader>
            <OptionButton onPress={() => { setTipoFormulario("servico"); setModalOpcoesVisivel(false); setModalVisivel(true); }}>
              <OptionButtonText>Novo Serviço</OptionButtonText>
            </OptionButton>
            <OptionButton secondary onPress={() => { setTipoFormulario("peca"); setModalOpcoesVisivel(false); setModalVisivel(true); }}>
              <OptionButtonText secondary>Nova Peça</OptionButtonText>
            </OptionButton>
            <CancelButton onPress={() => setModalOpcoesVisivel(false)}>
              <CancelButtonText>Cancelar</CancelButtonText>
            </CancelButton>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <ModalFormulario
        visivel={modalVisivel}
        titulo={tipoFormulario === "servico" ? "Adicionar Serviço" : "Adicionar Peça"}
        descricao={descricao}
        valor={valor}
        setDescricao={setDescricao}
        setValor={setValor}
        salvar={adicionarItem}
        fechar={() => setModalVisivel(false)}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #F8F9FA;
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
  background-color: #5A6BFF;
  margin-right: 12px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #2D3142;
`;

const TableHeader = styled.View`
  flex-direction: row;
  padding: 0 8px;
  margin-bottom: 12px;
`;

const HeaderLabel = styled.Text<{ flex: number; align?: string }>`
  flex: ${props => props.flex};
  font-weight: 700;
  color: #5A6BFF;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: ${props => props.align || 'left'};
`;

const EmptyText = styled.Text`
  color: #A0A4B8;
  font-style: italic;
  margin-left: 8px;
  margin-bottom: 16px;
`;

const FooterContainer = styled.View`
  background-color: #ffffff;
  padding: 20px 24px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;

  ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0px -4px;
    shadow-opacity: 0.05;
    shadow-radius: 10px;
  ` : 'elevation: 10;'}
`;

const TotalWrapper = styled.View`
  margin-bottom: 32px;
`;

const TotalLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #5A6BFF;
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
  color: #2D3142;
  width: 100%;
  text-align: right;
`;

const FabButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #5A6BFF;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 128px;
  right: 32px;
  elevation: 8;
  shadow-color: #5A6BFF;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
`;

const FabText = styled.Text`
  color: #FFFFFF;
  font-size: 32px;
  font-weight: 300;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(45, 49, 66, 0.7);
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: #FFFFFF;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  padding: 32px 24px;
  padding-bottom: ${Platform.OS === 'ios' ? '40px' : '32px'};
`;

const ModalHeader = styled.View`
  margin-bottom: 24px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #2D3142;
  text-align: center;
`;

const OptionButton = styled.TouchableOpacity<{ secondary?: boolean }>`
  width: 100%;
  height: 56px;
  background-color: ${props => props.secondary ? '#FFFFFF' : '#5A6BFF'};
  border-radius: 14px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  border-width: ${props => props.secondary ? '1.5px' : '0px'};
  border-color: #5A6BFF;
`;

const OptionButtonText = styled.Text<{ secondary?: boolean }>`
  font-weight: 700;
  color: ${props => props.secondary ? '#5A6BFF' : '#FFFFFF'};
  font-size: 16px;
`;

const CancelButton = styled.TouchableOpacity`
  margin-top: 8px;
  padding: 12px;
`;

const CancelButtonText = styled.Text`
  color: #A0A4B8;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;