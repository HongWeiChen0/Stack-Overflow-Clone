
## Instructions to setup and run project

1. Install the necessary dependencies by running **npm install** in both the _server_ and _client_ directory.
2. Make sure an instance of MongoDB is running with default setting **mongodb://127.0.0.1:27017/**. The name of the database is **fake_so**.
3. Start the server in the server directory with **node server/server.js**.
4. Run **npm start** in the client directory to start the website.

## Design Patterns

This project was implemented largely using the Flyweight Pattern. Since many components in this application need to use the data retrieved from the database, all data relating to questions, answers, tags, comments, and users are stored in fakestakcoverflow.js, opposed to retrieving and storing them separately in all components, which is slow and uses more memory. An example of this can be seen in the render method of fakestackoverflow.js where data is beeing passed as props to child components. This project also uses the Observer pattern to keep track of a component's child components and update them accordingly when state changes. An example of this would be the state _currentPage_ in fakestackoverflow.js which changes what's being rendered.

## Miscellaneous
For reputation testing, please log off your account if you're signed in after directly changing reputation in the database. 
