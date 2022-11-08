# What's Cookin'? Project

### All Recipes View
![updated-allrec](https://user-images.githubusercontent.com/110144802/200438259-1e561d48-30fd-4236-afa4-557df75102d1.gif)

### My Recipes View
![updated-myrecipe](https://user-images.githubusercontent.com/110144802/200620308-f178d2a1-9e1a-497a-971c-735e503ebe4e.gif)

### Abstract
Our fully remote team created a recipe site that presents users with an array of recipe cards which they can filter and search through by the type of recipe they are looking for while saving recipes to their "My Recipes" view. When viewing a recipe, users will be informed if they have the required ingredients in their pantry with the option to add them. There is a "My Recipes" view where users can review their bookmarked recipes and add any needed ingredients to their pantry. Users will find the site to be thoughtfully-designed, intuitive, and responsive to various screen sizes. 

This team project took place in the second term of the Turing front-end software engineering program and required students to synthesize all the technical and project management skills we have honed over the past weeks to create a fully functioning site from the design phase to production in four weeks. This project required extensive research to determine and implement new technologies to make the product surpass expectations.

### Feature Spotlight
In order to provide users with an expanded view of any recipe, we researched and determined MicroModal.js to be the best solution. We successfully implemented MicroModal as seen in the above gif. Users are able to see in red and green which ingredients they will need to add before cooking the selected recipe. This view is dynamic and guides the user if they are able to proceed with cooking the selected recipe—thus removing those ingredients from their pantry—or if they still need to add more ingredients beforehand.

### Contributors
[Spencer Haka](https://github.com/Speekins)\
[Tim Thomas](https://github.com/nalito223)\
[Sam Rice](https://github.com/sam-rice)\
[Zac Walters](https://github.com/zacwalters4)

### Research and Documentation 
Design document we developed with Excalidraw: 

<img width="721" alt="design-document" src="https://user-images.githubusercontent.com/110144802/197453877-d2a7e9bf-8101-469c-a3d1-78357162ab3c.png">

Our data model and DOM flowchart:

<img width="721" alt="datamodel-dom-flowchart" src="https://user-images.githubusercontent.com/110144802/197453843-48b590fb-aa9b-49c7-b5c8-ca69880ec131.png">

Agile/Scrum project board we created and managed in GitHub:

<img width="721" alt="project-board" src="https://user-images.githubusercontent.com/110144802/197453829-63de494b-d4f5-4438-9d22-38b9bccbe7b8.png">


### Technologies
- MicroModal.js 3rd party library
- Fetch API 
- Lighthouse and WAVE accessibility tools 
- Webpack module bundler 
- Git/GitHub
- GitHub project board 
- JavaScript
- CSS 
- HTML 
- Mocha JavaScript testing framework
- Chai assertion library 
- Node.JS
- Excalidraw 

### Methodologies
- Design the UI to adapt to various screen sizes
- Test-driven development 
- Error handling 
- Ensure accessiblity through WAI ARIA states, roles, and properties 
- Implement ES6 classes which support a complex data model
- Use object and array prototype methods to perform data manipulation
- Create a user interface that is easy to use and clearly displays information
- Write modular, reusable code that follows SRP (Single Responsibility Principle)
- Implement a robust testing suite using TDD
- Make network requests to retrieve data
- Demonstrate DRY principles 
- Utilize Agile/Scrum project management 

### Installation Instructions
1. Fork this repository.
2. Clone your new, forked repository to your local machine.
3. Clone [this API repository](https://github.com/turingschool-examples/whats-cookin-api) to your machine.
4. `cd` into the API repository on your local machine and run `npm install`, then `npm start` to launch the API's server.
5. In a seperate tab, `cd` into the main project repository on your local machine and run `npm install`, then npm start to launch the application's server.
7. Open the link to your local server (listed in your terminal) in your web browser to view the live page.
