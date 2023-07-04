import { Header } from "@components/Header";
import { Container, Content, Icon } from "./styles";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { groupCreate } from "@storage/group/groupCreate";
import { Alert } from "react-native";

export function NewGroup(){

    const [group, setGroup] = useState('')

    const navigation = useNavigation();

    async function handleGoBack(){
        try {

            if(group.length === 0){
                return Alert.alert('New group', `Share the crew's name`)
            }
            return console.log(group.trim().length)

            await groupCreate(group);
            navigation.navigate('players', { group });}
            catch (error) {
            throw error
        }
    }


    return (
        <Container>
            <Header showBackButton/>
            <Content>
                <Icon/>
                <Highlight
                title='New crew'
                subtitle="Create your new crew to add teammates."
                />
                <Input
                    placeholder="Crew name"
                    onChangeText={setGroup}
                />
                <Button 
                    title="Create" 
                    style={{marginTop: 20}}
                    onPress={handleGoBack}/>
            </Content>
        </Container>
    )
}