//
// //Start code for React
// 'use strict';
//
// const e = React.createElement;
//
// class reactButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { liked: false };
//   }
//
//   render() {
//     if (this.state.liked) {
//       return 'You liked this.';
//     }
//
//     return e(
//       'button',
//       { onClick: () => this.setState({ liked: true }) },
//       'Follow'
//     );
//   }
// }
//
// // these two lines of code find the <div> we added to our HTML
// const domContainer = document.querySelector('#react_container');
// ReactDOM.render(e(reactButton), domContainer);

// Cursor Component
const Cursor =  () => {

   const { useEffect, useState } = React;
   const [position, setPosition] = useState({x: 0, y: 0});

       useEffect(() => {
           addEventListeners();
           return () => removeEventListeners();
       }, []);

       const addEventListeners = () => {
           document.addEventListener("mousemove", onMouseMove);
       };

       const removeEventListeners = () => {
           document.removeEventListener("mousemove", onMouseMove);
       };

       const onMouseMove = (e) => {
           setPosition({x: e.pageX, y: e.pageY});
       };

  console.log(position.x)

        return (
          <div>
            <div style={{
               transform: `translate(${position.x}px, ${position.y}px)`}} className="cursor"></div>
            <div style={{
               transform: `translate(${position.x}px, ${position.y}px)`}} className="cursor-follower"></div>
          </div>
        )

}

//APP Component
class App extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="stage">
        <Cursor />
       </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
