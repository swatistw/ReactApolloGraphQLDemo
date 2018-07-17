# Signup, Login Into React Native Apps using graphQL, react-apollo with Facebook or Google Logging

## Backend
### Now, let’s set up the backend that handles signup, login using graphQL with mLab database and user authentication via Facebook and Google OAuth apps that we created in the previous steps.

#### These are the tools that we’re going to use:
*	Node.js. A platform that allows JavaScript to be used outside the Web Browsers, for creating web and network applications.
*	Express. Node.js web application framework.
*	Passport. An authentication middleware for Node.js.
*	Passport-Facebook. Facebook authentication strategy for Passport and Node.js.
*	Passport-Google-OAuth20. Google (OAuth 2.0) authentication strategy for Passport.
*	graphql-tools- graphql-tools package are not just useful for building servers. They can also be used in the browser, for example to mock a backend during development or testing
*	express-graphql- The express-graphql module provides a simple way to create an Express server that runs a GraphQL API.
*	Mongoose- Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.

#### Initialize Node.js Project
*	Create a new folder called backend:
<img src="Images/mkdir.png" alt="mkdir" width="640" />
Run npm init to create the package.json file, so we can install backend dependencies separately from React Native app:
<img src="Images/npminit.png" alt="npminit" width="640" />
It’s going to ask you a few questions. You can just press return to give the default answers for each question.

*	Install Dependencies
First, install dev dependencies that we’ll going to need during development:
<img src="Images/installDep.png" alt="installDep" width="640" />
And next, install the dependencies that we’ll use to do some work:
<img src="Images/installDep1.png" alt="installDep1" width="640" />

*	Create the Database in mLab
Login in mlab and create new 
<img src="Images/createMlab.png" alt="createMlab" width="640" />
<img src="Images/sandbox.png" alt="sandbox" width="640" />
<img src="Images/db_name.png" alt="db_name" width="640" />
<img src="Images/dbCreated.png" alt="dbCreated" width="640" />

*	Create User model

`
const userSchema = new Schema({

  
      email: String,
	  
      password: String,
	  
 
  
      id: String,
	  
      token: String,
	  
      name: String
	  
    
});

module.exports = mongoose.model('User',userSchema);

`
*	Create Schema user 
`
type User {

  _id: String!
  
  email: String!
  
  password: String!
  
}

type Mutation {

  createUser(email: String!, password: String!): User!
  
  login(email: String!, password: String!): String!
  
}


`
*	Create resolver 
`
Mutation: {

  createUser: async (parent, args, { User }) => {
  
  const userargs = args;
  
  
    const existingUser = await User.findOne({ email:userargs.email });
	
     if (existingUser) {
	 
       throw new Error('Email already used');
	   
     }
	 
  
    userargs.password = await bcrypt.hash(userargs.password, 12);
	
    return User.create(userargs);
	
  },
  

  login: async(parent, { email, password }, { User, SECRET }) => {
  
    const userch = await User.findOne({ email });
	
      if (!userch){
	  
        throw new Error('Not user with that email');
		
      }
	  
  
      const valid = await bcrypt.compare(password, userch.password);
	  
      if(!valid){
	  
        throw new Error('Incorrect password');
		
      }
	  
      const token = jwt.sign(
	  
      {
	  
        userch: _.pick(userch, ['id', 'username']),
		
      },
	  
      SECRET,
	  
      {
	  
          expiresIn: '1y',
		  
      }
	  
    );
	
      return token;
	  
  },
  

},


`


## Demo

<img src="https://github.com/rationalappdev/oauth-login/blob/master/demo.gif" alt="Demo" width="640" />
