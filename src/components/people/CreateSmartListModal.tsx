'use client';

import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';

import { CreateSmartList } from '@/lib/data/backend/smartLists';

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
});

interface CreateSmartListModalProps {
    userId: string;
}

export default function CreateSmartListModal({ userId }: CreateSmartListModalProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        const result = schema.safeParse({ name, description });

        if (!result.success) {
            toast.error("Error");
            return;
        }

        setIsLoading(true);

        try {
            await CreateSmartList(userId, name, description);
            toast.success('Smart list created!');
            location.reload();

            // Reset and close
            setName('');
            setDescription('');
            setOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to create smart list.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2 border-dashed">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Smart List
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Smart List</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter smart list name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleCreate} disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
