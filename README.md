## About

Genotype UI the user interface of [Genotype](https://github.com/Clinical-Genomics/genotype)


## Available Scripts

To install dependencies run:

### `yarn install`

To run the app:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />


To manually deploy the app to stage run:
```
yarn build
firebase use stage
firebase deploy
```

The app is deployed to stage and production environments in the GitHub Actions pipeline

