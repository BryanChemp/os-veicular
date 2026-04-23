import React, { useState } from "react";
import { TextInputProps, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface PropsCampo {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  inputProps?: TextInputProps;
  campoSenha?: boolean;
}

export const Campo: React.FC<PropsCampo> = ({
  label,
  value,
  onChangeText,
  inputProps,
  campoSenha,
}) => {
  const [visivel, setVisivel] = useState(false);

  return (
    <Container>
      <Label>{label}</Label>
      <InputWrapper>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#A0A4B8"
          secureTextEntry={campoSenha && !visivel}
          {...inputProps}
        />
        {campoSenha && (
          <ToggleButton onPress={() => setVisivel(!visivel)}>
            <FontAwesomeIcon
              icon={visivel ? faEyeSlash : faEye}
              size={18}
              color="#6c757d"
            />
          </ToggleButton>
        )}
      </InputWrapper>
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
`;

const Label = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #2d3142;
  margin-bottom: 8px;
  margin-left: 4px;
`;

const InputWrapper = styled.View`
  position: relative;
  justify-content: center;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 52px;
  padding: 0 48px 0 16px;
  border-radius: 12px;
  border-width: 1.5px;
  border-color: #e2e4ef;
  background-color: #ffffff;
  font-size: 16px;
  color: #2d3142;
`;

const ToggleButton = styled(TouchableOpacity)`
  position: absolute;
  right: 16px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;