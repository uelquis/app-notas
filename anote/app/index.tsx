import "@styles/global.css";
import { Button } from "@components/ui/button"; 
import { Text } from "@components/ui/text"; 
 
export default function App() {
  return (
    <Button className="size-48 bg-lime-600">
      <Text>
        Click Me!
      </Text>
    </Button>
  );
}
