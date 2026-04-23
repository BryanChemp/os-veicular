import React, { useState, useEffect } from "react";
import { Modal, Platform, ScrollView } from "react-native";
import styled from "styled-components/native";
import { Dropdown } from "./Dropdown";

type ModalFormularioProps = {
  visivel: boolean;
  titulo: string;
  descricao: string;
  valor: string;
  setDescricao: (text: string) => void;
  setValor: (text: string) => void;
  salvar: () => void;
  fechar: () => void;
};

const ITENS_SUGERIDOS = [
  { id: "1", descricao: "Pintura Parachoque", valor: "450,00" },
  { id: "2", descricao: "Polimento Cristalizado", valor: "300,00" },
  { id: "3", descricao: "Martelinho de Ouro", valor: "150,00" },
  { id: "4", descricao: "Mão de Obra Funilaria", valor: "600,00" },
];

export const ModalFormulario = ({
  visivel,
  titulo,
  descricao,
  valor,
  setDescricao,
  setValor,
  salvar,
  fechar,
}: ModalFormularioProps) => {
  const [modoManual, setModoManual] = useState(false);
  const camposHabilitados = modoManual || descricao !== "";

  useEffect(() => {
    if (!visivel) {
      setModoManual(false);
      setDescricao("");
      setValor("");
    }
  }, [visivel]);

  const tratarSelecaoDropdown = (valorSelecionado: string) => {
    const item = ITENS_SUGERIDOS.find((i) => i.valor === valorSelecionado);
    if (item) {
      setModoManual(false); // Garante que não está no manual se selecionou do dropdown
      setDescricao(item.descricao);
      setValor(item.valor);
    }
  };

  return (
    <Modal visible={visivel} transparent animationType="fade">
      <ModalOverlay>
        <ModalContent behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <Header>
            <TitleContainer>
              <Bullet />
              <ModalTitle>{titulo}</ModalTitle>
            </TitleContainer>
            <CloseButton onPress={fechar}>
              <CloseText>×</CloseText>
            </CloseButton>
          </Header>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            
            <Dropdown
              label="Pesquisar Nos Cadastrados"
              onValueChange={tratarSelecaoDropdown}
              enableSearch
              options={ITENS_SUGERIDOS.map((item) => ({
                label: `${item.descricao} - R$ ${item.valor}`,
                value: item.valor,
              }))}
            />

            <ActionWrapper>
              <NewItemLink onPress={() => {
                setModoManual(true);
                setDescricao("");
                setValor("");
              }}>
                <NewItemLinkText>+ Cadastrar Novo Item</NewItemLinkText>
              </NewItemLink>
            </ActionWrapper>

            <FormContainer style={{ opacity: camposHabilitados ? 1 : 0.5 }}>
              <InputGroup>
                <Label>Descrição</Label>
                <StyledInput
                  placeholder="Ex: Troca De Lanterna"
                  placeholderTextColor="#A0A4B8"
                  value={descricao}
                  onChangeText={setDescricao}
                  editable={camposHabilitados}
                  isHabilitado={camposHabilitados}
                />
              </InputGroup>

              <InputGroup>
                <Label>Valor (R$)</Label>
                <StyledInput
                  placeholder="0,00"
                  placeholderTextColor="#A0A4B8"
                  value={valor}
                  keyboardType="numeric"
                  onChangeText={setValor}
                  editable={camposHabilitados}
                  isHabilitado={camposHabilitados}
                />
              </InputGroup>
            </FormContainer>

            {camposHabilitados && (
              <SaveButton onPress={salvar}>
                <SaveButtonText>Adicionar Ao Orçamento</SaveButtonText>
              </SaveButton>
            )}

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

const NewItemLinkText = styled.Text`
  color: #5a6bff;
  font-weight: 700;
  font-size: 14px;
  text-decoration-line: underline;
`;

const FormContainer = styled.View`
  margin-top: 10px;
`;

const InputGroup = styled.View`
  margin-bottom: 16px;
`;

const Label = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #5a6bff;
  margin-bottom: 6px;
`;

const StyledInput = styled.TextInput<{ isHabilitado: boolean }>`
  background-color: ${props => props.isHabilitado ? '#F8F9FA' : '#F1F2F6'};
  border-width: 1.5px;
  border-color: ${props => props.isHabilitado ? '#E2E4EF' : '#EBECEF'};
  border-radius: 14px;
  height: 56px;
  padding-horizontal: 16px;
  font-size: 16px;
  color: #2d3142;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #5a6bff;
  height: 56px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  elevation: 2;
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