import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity
} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class Login extends Component<{}> {
    goBack(){
        Actions.login();
    }
	render() {
		return(
			<View style={styles.container}>
				<TouchableOpacity onPress={this.goBack}>
				    <Text>Click me, to go back</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#455a64',
    flex: 1,
    alignItems:'center',
    justifyContent :'center'
  }
});
