import { Provider } from "react-redux";
import { store } from "./store";
import Navigation from "./Navagation";

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
