'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AddTagToContact, RemoveTagFromContact, CreateTag, DeleteTag } from "@/lib/data/backend/clientCalls";
import { Tag } from "@/lib/definitions/backend/tag";

interface TagsSectionProps {
    contactId: string;
    contactTags: Tag[];
    availableTags: Tag[];
}

export default function TagsSection({ contactId, contactTags, availableTags }: TagsSectionProps) {
    const router = useRouter();
    const [tags, setTags] = useState<Tag[]>(contactTags);
    const [open, setOpen] = useState(false);

    // Modal state
    const [search, setSearch] = useState("");
    const [filteredTags, setFilteredTags] = useState<Tag[]>(availableTags);
    const [showCreate, setShowCreate] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [newTagDescription, setNewTagDescription] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        setFilteredTags(
            availableTags.filter(
                t => !tags.some(tag => tag.ID === t.ID) && t.Name?.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, tags, availableTags]);

    const handleAddTag = async (tag: Tag) => {
        try {
            await AddTagToContact(contactId, tag.ID);
            setTags([...tags, tag]);
            toast.success("Tag added!");
            router.refresh();
        } catch {
            toast.error("Failed to add tag");
        }
    };

    const handleRemoveTag = async (tagId: string) => {
        try {
            await RemoveTagFromContact(contactId, tagId);
            setTags(tags.filter(t => t.ID !== tagId));
            toast.success("Tag removed!");
            router.refresh();
        } catch {
            toast.error("Failed to remove tag");
        }
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim() || !newTagDescription.trim()) return;
        setIsCreating(true);
        try {
            const created = await CreateTag(newTagName.trim(), newTagDescription.trim());
            setTags([...tags, created]);
            setNewTagName("");
            setNewTagDescription("");
            setShowCreate(false);
            toast.success("Tag created and added!");
            router.refresh();
        } catch {
            toast.error("Failed to create tag");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <>
            {/* Tag badges or plus icon */}
            <div className="flex flex-wrap gap-2 items-center">
                {tags.length > 0 ? (
                    <>
                        {tags.map(tag => (
                            <Badge
                                key={tag.ID}
                                variant="secondary"
                                className="group flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            >
                                {tag.Name}
                                <button
                                    onClick={() => handleRemoveTag(tag.ID)}
                                    className="ml-1 rounded-full p-0.5 hover:bg-purple-300 dark:hover:bg-purple-800"
                                    title="Remove tag"
                                >
                                    ×
                                </button>
                            </Badge>
                        ))}
                        {/* Plus button to open modal */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpen(true)}
                        >
                            +
                        </Button>
                    </>
                ) : (
                    <button
                        onClick={() => setOpen(true)}
                        className="h-8 w-8 flex items-center justify-center rounded-full border border-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                        title="Add tags"
                    >
                        +
                    </button>
                )}
            </div>

            {/* Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div />
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Manage Tags</DialogTitle>
                        <DialogDescription>
                            Add, remove, or create tags for this contact.
                        </DialogDescription>
                    </DialogHeader>

                    {/* --- Assigned tags at top --- */}
                    <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Assigned Tags</h3>
                        {tags.length === 0 ? (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">No tags assigned.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <Badge
                                        key={tag.ID}
                                        variant="secondary"
                                        className="flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                    >
                                        {tag.Name}
                                        <button
                                            onClick={() => handleRemoveTag(tag.ID)}
                                            className="ml-1 rounded-full p-0.5 hover:bg-purple-300 dark:hover:bg-purple-800"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- Search + Create Button --- */}
                    <div className="mb-4 flex gap-2 items-center">
                        <Input
                            placeholder="Search tags..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>+</Button>
                    </div>

                    {/* --- Create Form --- */}
                    {showCreate && (
                        <div className="mb-4 space-y-2 border rounded p-3 bg-zinc-50 dark:bg-zinc-800/50">
                            <Input
                                placeholder="New tag name"
                                value={newTagName}
                                onChange={e => setNewTagName(e.target.value)}
                            />
                            <Textarea
                                placeholder="Tag description"
                                value={newTagDescription}
                                onChange={e => setNewTagDescription(e.target.value)}
                            />
                            <Button
                                onClick={handleCreateTag}
                                disabled={isCreating || !newTagName || !newTagDescription}
                            >
                                {isCreating ? "Creating..." : "Create Tag"}
                            </Button>
                        </div>
                    )}

                    {/* --- Available tags in table --- */}
                    <h3 className="text-sm font-medium mb-2">Available Tags</h3>
                    <ScrollArea className="max-h-72 border rounded-md">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-100 dark:bg-zinc-800 sticky top-0">
                                <tr>
                                    <th className="text-left px-3 py-2">Name</th>
                                    <th className="text-left px-3 py-2">Description</th>
                                    <th className="px-3 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTags.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center text-xs text-zinc-500 py-3">
                                            No tags found.
                                        </td>
                                    </tr>
                                )}

                                {filteredTags.map(tag => (
                                    <tr key={tag.ID} className="border-b border-zinc-200 dark:border-zinc-700">
                                        <td className="px-3 py-2">{tag.Name}</td>
                                        <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                                            {tag.Description.Valid ? tag.Description.String : <span className="italic text-zinc-400">No description</span>}
                                        </td>
                                        <td className="px-3 py-2 flex gap-2 justify-center">
                                            {/* Add to Contact */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAddTag(tag)}
                                            >
                                                +
                                            </Button>

                                            {/* Delete from DB */}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={async () => {
                                                    try {
                                                        await DeleteTag(tag.ID);
                                                        toast.success("Tag deleted");
                                                        router.refresh();
                                                    } catch {
                                                        toast.error("Failed to delete tag");
                                                    }
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ScrollArea>

                    <DialogFooter>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
