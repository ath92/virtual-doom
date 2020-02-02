# Virtual doom

### [Demo](https://maanraket.nl/experiments/virtual-doom/)

Virtual DOOM is a first-person 3D demo that uses the DOM as its render engine. This is an exercise in finding out what is possible with the 3d capabilities of modern browsers using just HTML/CSS for the actual rendering, i.e. no WebGL, canvas or SVG. It uses React to manage state and perform actual updates to the DOM.

### Rendering

Roughly speaking, the app is structured as follows:

```
Player -> Camera -> Scene
```

The `Player` component manages most game state: position, looking direction, speed, which keys are pressed, etc. This is passed on to the `Camera` component, which wraps everything in a div with the correct `transform` css properties set, so that the entire scene is transformed in the expected way.

### Transformations

The app comes with some handy components that let you position things (i.e. any HTML element) in the 3D world: `<Transform>`, `<Translate>` and `<Rotate>`. These position their children, and also provide a `TransformContext` for any child component that needs to know where it is / how it is rotated in 3d space.

### Collision detection

In first person engines, you need collision detection to prevent the player from walking through walls. And since we use the pointer lock API to prevent the cursor from moving out of the browser window, we also need a way of knowing what the player is looking at / clicking on.

The app provides a handy primitive for this: `<Intersectable>`. This component measures its content (by looking at its own `offsetWidth`/`offsetHeight`), and uses the `TransformContext` to know where it is in 3D space. Each `Intersectable` therefore represents a rectangle in 3D space, which we can use to do collision detection. 

To know what the player is looking at, we can cast a ray from the camera position in the direction the player is looking at. Any `Intersectable` that intersects with this ray is in the player's line of sight. We can then compare the distances along the ray of each intersection to find the nearest element that is being looked at.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).