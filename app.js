/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar
} from 'react-native';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { ApolloProvider } from 'react-apollo';
import Routes from './src/Routes';

// The http link is the most common Apollo Link.
const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://192.168.1.9:4000/graphql' }),
  cache: new InMemoryCache()
});

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
            <StatusBar
               backgroundColor="#1c313a"
               barStyle="light-content"
            />
            <ApolloProvider client={client}>
                <Routes/>
            </ApolloProvider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
  }
});
