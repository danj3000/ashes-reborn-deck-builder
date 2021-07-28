import React, {useContext, useEffect, useState} from 'react';
import {Button, StyleSheet, FlatList, View} from 'react-native';

import {GlobalContext} from '../../store/global-store';
import DeckListItem from './deck-list-item';
import {getOwnedReleases, getReleases} from '../../services/releases-service';
import {setCardsFromReleases} from '../../services/cards-service';
import {getDeckFilenames} from '../../services/decks-service';
import Loading from '../util/loading';

const DecksScreen = ({navigation}) => {
  const {
    decks,
    setCards,
    setDecks,
    setReleases,
    setOwnedReleases,
    addDeck,
    saveDecks,
    removeDeck,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      getReleases().then(releases => {
        setReleases(releases);
        setCardsFromReleases(releases, setCards);
      }),
      getDeckFilenames().then(loadedDecks => setDecks(loadedDecks)),
      getOwnedReleases().then(ownedReleases => setOwnedReleases(ownedReleases)),
    ]).finally(() => setLoading(false));

    return () => {
      saveDecks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading === true) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Button
        title="Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <FlatList
        data={decks}
        renderItem={({item}) => (
          <DeckListItem
            name={item.name}
            pheonixBorn={item.pheonixBorn}
            pheonixBornStub={item.pheonixBornStub}
            onPress={() => {
              navigation.navigate('Deck', {filename: item.filename});
            }}
            onDelete={() => removeDeck(item.filename)}
          />
        )}
        keyExtractor={item => item.filename}
      />
      <Button
        title="New Deck"
        onPress={() => {
          let newDeck = {
            filename: `${Date.now().toString(16)}_ASHES_DECK`,
            name: '',
            pheonixBorn: null,
            cards: {},
          };
          addDeck(newDeck);
          navigation.navigate('Deck', {
            filename: newDeck.filename,
            newDeck: true,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    margin: 10,
    padding: 10,
    fontSize: 18,
    height: 44,
    backgroundColor: 'beige',
  },
});

export default DecksScreen;
