import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity ,
  Item,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome';

class Form extends Component<{}> {

    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:''
        };
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.state = {email:'',password:''};
    }

    handleEmail(text){
        this.setState({
            email:text
        })
    }
    handlePassword(text){
        this.setState({
            password:text
        })
    }
    onAuth(){
        if(this.props.type == 'Signup'){
           this.props.createUser(this.state.email,this.state.password).then(() =>{
                Actions.login();
           })
           .catch(() => {
                alert("Unsuccessful..Check connection or email already used");
           });
        }
        else {
            this.props.login(this.state.email,this.state.password).then(() =>{
               Actions.home();
            })
            .catch(() => {
                alert("Unsuccessful Login..try again");
            })

        }
    }
    sAuth(){
        Actions.sAuth();
    }

	render(){
		return(
		    <View style={styles.container}>
                  <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      placeholder="Email"
                      placeholderTextColor = "#ffffff"
                      selectionColor="#fff"
                      keyboardType="email-address"
                      onChangeText={this.handleEmail}
                      onSubmitEditing={()=> this.password.focus()}
                  />
                  <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      placeholder="Password"
                      secureTextEntry={true}
                      placeholderTextColor = "#ffffff"
                      onChangeText={this.handlePassword}

                  />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={this.onAuth.bind(this)}>{this.props.type}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                     <Text style={styles.buttonText} onPress={this.sAuth.bind(this)}>Social Login</Text>
                </TouchableOpacity>

  		    </View>
		);
	}
}

const signupMutation = gql`
   mutation ($email: String!, $password: String!) {
     createUser(email: $email, password: $password) {
       email
       password
     }
   }`
const loginMutation = gql`
   mutation ($email: String!, $password: String!) {
     login(email: $email, password: $password)
  }`

export default compose(
  graphql(signupMutation, { props: ({ mutate }) => ({
   createUser: (email, password) => mutate({ variables: { email, password } }),
   })
 }),
 graphql(loginMutation, { props: ({ mutate }) => ({
    login: (email, password) => mutate({ variables: { email, password } }),
    })
  })
 )(Form);

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
  },

  inputBox: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  iconStyle :{
    color:'#1c313a',
  },
  button: {
    width:300,
    backgroundColor:'#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  signupTextCont : {
    alignItems:'flex-end',
    justifyContent :'center',
    flexDirection:'row'
  },
  buttonFac: {
      width:150,
      backgroundColor:'#1c313a',
      borderRadius: 25,
      marginVertical: 5,
      paddingVertical: 8
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  }
  
});