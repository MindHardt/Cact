import {Alert} from "@heroui/react";


export default function NothingFound() {
    return <Alert status='accent'>
        <Alert.Indicator />
        <Alert.Content>
            <Alert.Title>Ничего не найдено</Alert.Title>
        </Alert.Content>
    </Alert>;
}