import { Provider } from "react-redux";
import { store } from "./store";
import NavigationComponent from "./NavagationComponent";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationComponent />
    </Provider>
  );
}
