import React, { FC, useMemo, useRef, useState, useEffect } from "react"
import { Animated, TextInputProps, FlatList, Modal, TouchableWithoutFeedback, View } from "react-native"
import styled from "styled-components/native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faChevronDown, faChevronUp, faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { MDText } from "./MDText"

interface Option { 
    label: string 
    value: string 
}

interface DropdownProps extends TextInputProps {
    label?: string
    options: Option[] | string[]
    value?: string
    onValueChange: (value: string) => void
    enableSearch?: boolean
    error?: string
    errorTrigger?: number
}

export const Dropdown: FC<DropdownProps> = ({
    label,
    options,
    value,
    onValueChange,
    enableSearch = false,
    error,
    errorTrigger
}) => {
    const [open, setOpen] = useState(false)
    const [visible, setVisible] = useState(false)
    const [search, setSearch] = useState("")
    const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 })

    const containerRef = useRef<View>(null)
    const animation = useRef(new Animated.Value(0)).current

    const fadeAnim = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(-4)).current
    const shakeAnim = useRef(new Animated.Value(0)).current

    const normalizedOptions = useMemo(
        () => options.map(opt =>
            typeof opt === "string" ? { label: opt, value: opt } : opt
        ),
        [options]
    )

    const filteredOptions = useMemo(() => {
        if (!enableSearch || !search) return normalizedOptions
        return normalizedOptions.filter(opt =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, normalizedOptions, enableSearch])

    useEffect(() => {
        if (open) {
            setVisible(true)
            Animated.timing(animation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else {
            Animated.timing(animation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false
            }).start(() => {
                setVisible(false)
            })
        }
    }, [animation, open])

    useEffect(() => {
        if (error) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true
                })
            ]).start()
        } else {
            fadeAnim.setValue(0)
            translateY.setValue(-4)
        }
    }, [error, fadeAnim, translateY])

    useEffect(() => {
        if (!error) return

        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 4, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -4, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start()
    }, [errorTrigger, shakeAnim, error])

    const heightInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 260]
    })

    const selectedLabel = normalizedOptions.find(o => o.value === value)?.label

    const handleOpen = () => {
        containerRef.current?.measureInWindow((x, y, width, height) => {
            setLayout({ x, y, width, height })
            setSearch("")
            setOpen(true)
        })
    }

    const handleClose = () => {
        setOpen(false)
        setSearch("")
    }

    return (
        <FieldContainer>
            {label && <Label>{label}</Label>}

            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                <InputWrapper
                    ref={containerRef}
                    activeOpacity={1}
                    onPress={handleOpen}
                    isOpen={open}
                    hasError={!!error}
                >
                    <StyledInput
                        value={selectedLabel || ""}
                        placeholder="Selecione..."
                        editable={false}
                        pointerEvents="none"
                    />

                    <IconButton onPress={open ? handleClose : handleOpen}>
                        <FontAwesomeIcon
                            icon={open ? faChevronUp : faChevronDown}
                            size={14}
                            color={open ? "#333" : "#999"}
                        />
                    </IconButton>
                </InputWrapper>
            </Animated.View>

            {!!error && (
                <AnimatedErrorContainer
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY }]
                    }}
                >
                    <FontAwesomeIcon icon={faExclamationCircle} color={"#ee1212"} size={14}/>
                    <MDText
                        textProps={{
                            style: {
                                color: "#ff0303",
                                fontSize: 14
                            }
                        }}
                        texto={error}
                    />
                </AnimatedErrorContainer>
            )}

            {visible && (
                <Modal transparent animationType="none">
                    <TouchableWithoutFeedback onPress={handleClose}>
                        <Backdrop>
                            <ListFloatingContainer
                                style={{
                                    top: layout.y + layout.height + 2,
                                    left: layout.x,
                                    width: layout.width,
                                    height: heightInterpolate,
                                    opacity: animation
                                }}
                            >
                                <TouchableWithoutFeedback>
                                    <InnerContainer>

                                        {enableSearch && (
                                            <SearchContainer>
                                                <SearchInput
                                                    value={search}
                                                    onChangeText={setSearch}
                                                    placeholder="Buscar..."
                                                    autoFocus
                                                    placeholderTextColor="#999"
                                                />
                                            </SearchContainer>
                                        )}

                                        <FlatList
                                            data={filteredOptions}
                                            keyExtractor={item => item.value}
                                            keyboardShouldPersistTaps="handled"
                                            ItemSeparatorComponent={() => <Separator />}
                                            showsVerticalScrollIndicator
                                            renderItem={({ item }) => (
                                                <OptionItem
                                                    onPress={() => {
                                                        onValueChange(item.value)
                                                        handleClose()
                                                    }}
                                                >
                                                    <OptionText isSelected={value === item.value}>
                                                        {item.label}
                                                    </OptionText>
                                                </OptionItem>
                                            )}
                                            ListEmptyComponent={
                                                <EmptyText>Nenhum resultado</EmptyText>
                                            }
                                        />
                                    </InnerContainer>
                                </TouchableWithoutFeedback>
                            </ListFloatingContainer>
                        </Backdrop>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </FieldContainer>
    )
}

const FieldContainer = styled.View`
    gap: 8px;
`

const Label = styled.Text`
    font-size: 14px;
    font-family: "Urbanist-Bold";
    margin-left: 4px;
`

const InputWrapper = styled.TouchableOpacity<{ isOpen: boolean; hasError: boolean }>`
    width: 100%;
    height: 48px;
    flex-direction: row;
    align-items: center;
    background-color: #F9F9F9;
    border-width: 1px;
    border-color: ${({ isOpen, hasError }) =>
        hasError ? "#ff0303" : isOpen ? "#5a6bff" : "#E0E0E0"};
    border-radius: 12px;
    position: relative;
`

const StyledInput = styled.TextInput`
    flex: 1;
    height: 100%;
    padding: 0 45px 0 16px;
    font-size: 14px;
    color: #333;
    font-family: "Urbanist-Regular";
`

const IconButton = styled.TouchableOpacity`
    position: absolute;
    right: 0;
    width: 45px;
    height: 56px;
    justify-content: center;
    align-items: center;
`

const Backdrop = styled.View`
    flex: 1;
`

const InnerContainer = styled.View`
    flex: 1;
`

const ListFloatingContainer = styled(Animated.View)`
    position: absolute;
    background-color: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    elevation: 10;
    shadow-color: #000;
    shadow-offset: 0px 5px;
    shadow-opacity: 0.2;
    shadow-radius: 8px;
    border-width: 1px;
    border-color: #EAEAEA;
`

const SearchContainer = styled.View`
    padding: 8px 12px;
    border-bottom-width: 1px;
    border-bottom-color: #F0F0F0;
`

const SearchInput = styled.TextInput`
    height: 40px;
    background-color: #F5F5F5;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 14px;
    color: #333;
    font-family: "Urbanist-Regular";
`

const OptionItem = styled.TouchableOpacity`
    height: 50px;
    justify-content: center;
    padding: 0 20px;
`

const Separator = styled.View`
    height: 1px;
    background-color: #F0F0F0;
    margin: 0 12px;
`

const OptionText = styled.Text<{ isSelected: boolean }>`
    font-size: 16px;
    font-family: ${({ isSelected }) => isSelected ? "Urbanist-Bold" : "Urbanist-Regular"};
    color: ${({ isSelected }) => isSelected ? "#5a6bff" : "#333"};
`

const EmptyText = styled.Text`
    padding: 20px;
    text-align: center;
    color: #999;
    font-family: "Urbanist-Regular";
`

const AnimatedErrorContainer = styled(Animated.View)`
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`