import { FC } from "react"
import styled from "styled-components/native"
import Constants from "expo-constants";

export const Footer: FC = () => {
    
    const versao = Constants.expoConfig?.version
    
    return (
        <Container>
            <VersaoApp>{versao}</VersaoApp>
        </Container>
    )
}

const Container = styled.View`
    width: 100%;
    align-items: center;
    justify-content: center;
    flex: 0.1;
    padding-bottom: 16px;
`;

const VersaoApp = styled.Text`
    color: black;
`;