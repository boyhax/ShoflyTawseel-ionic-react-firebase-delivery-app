
## this app is working but not updated for a while and the comments is not there and no docs provided ,
little experience required but the code is simple since i made it while i was a beginner.

## Features
* both client and service provider screens and logic 
* realtime chat and realtime 
* mobile auth
* delviery request system
* admin ui for accepting providers

# delivry help and share app (Ionic React, Capacitor and firebase)

delivery app for person to person help that runs on iOS, Android, and the web - with just one codebase. This is the complete project referenced in the ["Your First App: React" guide](https://ionicframework.com/docs/react/your-first-app). Follow along to create a complete CRUD (create-read-update-delete) experience.

Powered by [Ionic React](https://ionicframework.com/docs/react) (web app) and [Capacitor](https://capacitor.ionicframework.com) (native app runtime).

## How It Works

After the user navigates to Tab 2 (Photos), they can tap/click on the camera button to open up the device's camera. After taking or selecting a photo, it's stored permanently into the device's filesystem. When the user reopens the app at a later time, the photo images are loaded from the filesystem and displayed again in the gallery. The user can tap on a photo to be presented with the option to remove the photo.

## Feature Overview
* App framework: [React](https://reactjs.org/) 
* [tailwindcss](https://tailwindcss.com/) 
* [pullstate](https://lostpebble.github.io/pullstate/) 
* UI components: [Ionic Framework](https://ionicframework.com/docs/components)
  * Camera button: [Floating Action Button (FAB)](https://ionicframework.com/docs/api/fab)
* Native runtime: [Capacitor](https://capacitor.ionicframework.com)
  * Taking photos: [Camera API](https://capacitor.ionicframework.com/docs/apis/camera)
  * Storing photo in firebase storage: [Storage API](https://capacitor.ionicframework.com/docs/apis/storage)
* backend: [firebase](https://firebase.com)
 * auth
 * realtime chat
 * orders query
 * images storage
## Project Structure


## How to Run

> Note: It's highly recommended to follow along with the [tutorial guide](https://ionicframework.com/docs/react/your-first-app), which goes into more depth, but this is the fastest way to run the app. 

0) Install Ionic if needed: `npm install -g @ionic/cli`.
1) Clone this repository.
2) In a terminal, change directory into the repo: `cd shoflytawseel`.
3) Install all packages: `npm install or yarn install or pnpm install`.
4) Run on the web: `react-scripts start or ionic serve`.
5) Run on iOS or Android: See [here](https://ionicframework.com/docs/building/running).
