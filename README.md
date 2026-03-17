### Beep-Food
# Running the App

#Start Metro
```
cd /Users/carsonfouts/Documents/Beep-Food
npm start
```

- In another Terminal window, run:
```
cd /Users/carsonfouts/Documents/Beep-Food
npx react-native run-ios --simulator="iPhone 15 Pro" --no-packager
```

cmd + space + simulator = "Simulator.app"


## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```