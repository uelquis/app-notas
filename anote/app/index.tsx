import "@styles/global.css";
import { Button } from "@components/ui/button"; 
import { Text } from "@components/ui/text";
import { PlusIcon } from "lucide-react-native";
import { View } from "react-native";
import { FlatList } from "react-native";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
 
export default function App() {
  let notes = [
    { id: "1", creation_date: new Date(), title: "Note 1", content: "Content for Note 1" },
    { id: "2", creation_date: new Date(), title: "Note 2", content: "Content for Note 2" },
    { id: "3", creation_date: new Date(), title: "Note 3", content: "Content for Note 3" }
  ];

  return (
    <View className="flex-1 p-6">
      <FlatList
        className="gap-2"
        data={notes}
        renderItem={noteItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
      <View className="absolute bottom-4 right-4 px-4 py-16">
        <Button className="bg-[#89986D] active:bg-[#89986D]/70 size-24">
          <PlusIcon size={48} color="#f8fafc" />
        </Button>
      </View>
    </View>
  );
}

type Note = {
  id: string;
  creation_date: Date;
  title: string;
  content: string;
};

const noteItem = ({ item }: { item: Note }) => {
  return (
    <Card className="bg-[#9CAB84] border-0">
      <CardHeader>
        <CardTitle className="text-slate-50 text-lg font-bold"> {item.title} </CardTitle>
        <CardDescription className="text-slate-700">
          {item.creation_date.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
