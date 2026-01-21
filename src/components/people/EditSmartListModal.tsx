import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Pencil } from "lucide-react";
import { SmartList } from "@/lib/definitions/backend/smartList";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { DeleteSmartList, UpdateSmartList } from "@/lib/data/backend/clientCalls";
import { useContactsNav } from "@/lib/hooks/UseContactsNav";

interface EditSmartListModalProps {
    smartList: SmartList;
}

export default function EditSmartListModal({ smartList }: EditSmartListModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // State
    const [name, setName] = useState(smartList.Name);
    const [description, setDescription] = useState(smartList.Description.Valid ? smartList.Description.String : "");

    // zustand store state
    const setListId = useContactsNav((state) => state.setListId);


    // Handlers
    const handleSave = async () => {
        try {
            await UpdateSmartList(smartList.ID, name, description);
        } catch (error) {
            console.error("Error saving smart list:", error);
        }
        setIsOpen(false);
        router.refresh();
    }

    const handleDelete = async () => {
        try {
            await DeleteSmartList(smartList.ID);
        } catch (error) {
            console.error("Error deleting smart list:", error);
        }
        setIsOpen(false);
        setListId('');
        router.push('/people');
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <Pencil className="w-4 h-4 cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Smart List</DialogTitle>
                    <DialogDescription>
                        Edit the details of your smart list here.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 rounded-lg border p-4">
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Smart List Name"
                        className="w-full border p-2 rounded"
                    />
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Smart List Description"
                        className="w-full border p-2 rounded mt-2"
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="default"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
