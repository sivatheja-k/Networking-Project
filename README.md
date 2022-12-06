# UTA Attendance System

In this documentation we show how to use our detection service with webcamera. **NOTE:** we have chosen reactjs as it is today's one of the most popular UI library.

1. Clone our repository
2. Enter to ```webcam_demo``` folder and install packages

``` cd webcam_demo```

```npm install```

3. Change detection API key inside ```src > App.js``` line ```40```

4. Start project

```npm start```

5. Click ```video start``` button to start your webcamera 

*OR follow below instructions to create project by yourself*

1. Install reactjs

```npx create-react-app compreface-demo```

2. Enter to project folder

```cd compreface-demo```

3. Install CompreFace SDK

```npm i @exadel/compreface-js-sdk```

4. Create your component and copy/past following code. NOTE: We have used functional component and video tag used to connect to your webcamera and canvas tags used for drawing square and some extra data.

