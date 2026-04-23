import { FC, useMemo } from "react";
import { TextProps } from "react-native";
import styled from "styled-components/native";

interface MDTextProps extends TextProps {
    texto: string
    textProps?: TextProps
}

export const MDText: FC<MDTextProps> = ({
	texto,
    textProps
}) => {

	const partes = useMemo(() => texto.split(/(\*[^*]+\*)/g), [texto]);

	return (
		<Texto {...textProps}>
			{partes.map((parte, index) => {
				if (parte.startsWith("*") && parte.endsWith("*")) {
					return (
						<Bold key={index}>
							{parte.slice(1, -1)}
						</Bold>
					);
				}

				return parte;
			})}
		</Texto>
	);
};

const Texto = styled.Text`
    font-family: 'Urbanist-Regular';
    font-size: 14px;
    line-height: 20px;
    color: #4b5563;
	width: 100%;
`;

const Bold = styled.Text`
    font-family: 'Urbanist-Bold';
`;