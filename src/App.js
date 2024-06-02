// file App.js

import Pages from "./pages/Pages";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <h1 className="App">
      <BrowserRouter>
        <Pages></Pages>
      </BrowserRouter>
    </h1>
  );
}

export default App;

// export default function App() {
//   return (
//     <h1 className="text-3xl font-bold text-center text-red-600">
//       Hello world!
//     </h1>
//   )
// }