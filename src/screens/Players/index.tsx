import { useState, useEffect, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert, FlatList, TextInput, Keyboard } from "react-native";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { AppError } from '@utils/AppError';
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/playerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

type RouteParams ={
    group: string;
}

export function Players(){
    const [newPlayerName, setNewPlayerName] = useState('')
    const [team, setTeam] = useState('Team A');
    const [players, setPlayers ] = useState<PlayerStorageDTO[]>([]);

    const navigation = useNavigation();

    const route = useRoute();

    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null)

    async function handleAddPlayer() {
        if(newPlayerName.trim().length === 0 ){
            return Alert.alert(`New person`, `Share the person's name`)
        }
    
    const newPlayer = {
        name: newPlayerName,
        team,
    }

    try {
        await playerAddByGroup(newPlayer, group);

        newPlayerNameInputRef.current?.blur();
        Keyboard.dismiss();
        
        setNewPlayerName('');
        fetchPlayersByTeam();

    } catch (error) {
        if (error instanceof AppError){
            Alert.alert('New person', error.message)
        } else{
            console.log(error)
            Alert.alert('New person', 'We could not add this name')
        }
    }
    }

    async function fetchPlayersByTeam(){
        try{
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
    
        } catch(error){
            console.log(error);
            Alert.alert(`New person`, `It wasn't possible to load the list`)
        }
    }

    async function handleRemovePlayer(playerName:string) {
        try {
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();

        } catch (error) {
            console.log(error)
            Alert.alert(`Remove player`, `It wasn't possible to remove this player.`)
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups');
            
        } catch (error) {
            Alert.alert(`Remove group`, `It wasn't possible to remove this group.`)
        }
    }

    async function handleGroupRemove() {
        Alert.alert(
            `Remove`,
            `Do you want to remove this group?`,
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: () => groupRemove() }
              ]
        )
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);


    return(
        <Container>
            <Header showBackButton />
            <Highlight
                title={group}
                subtitle="Add your teammates to separate the teams."
            />
            <Form>
                <Input
                    inputRef = {newPlayerNameInputRef}
                    placeholder="Participant name"
                    autoCorrect = {false}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />
                <ButtonIcon
                    icon="add"
                    onPress={handleAddPlayer}
                />
            </Form>

        <HeaderList>
            <FlatList
                data={['Team A', 'Team B']}
                keyExtractor={item => item}
                renderItem={({ item })=> (
                    <Filter
                        title={item}
                        isActive={item === team}
                        onPress={() => setTeam(item)}
                    />
                )}
                horizontal
            />
            <NumbersOfPlayers>
                {players.length}
            </NumbersOfPlayers>
        </HeaderList>

        <FlatList
            data={players}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
                <PlayerCard 
                    name={item.name} 
                    onRemove={() => handleRemovePlayer(item.name)} 
                    />
            )}
            ListEmptyComponent={ () => (
                <ListEmpty message="There are no players in this team."
            />
            )}
            showsVerticalScrollIndicator ={false}
            contentContainerStyle={[
                {paddingBottom: 50},
                players.length === 0 && { flex: 1 }
            ]}
        />

        <Button 
            title="Remove crew"
            type="SECONDARY"
            onPress={handleGroupRemove}
        />

        </Container>
    )
}