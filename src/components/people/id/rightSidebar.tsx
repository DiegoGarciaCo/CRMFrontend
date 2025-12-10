"use client";

import { Appointment } from "@/lib/definitions/backend/appointments";
import { Deal } from "@/lib/definitions/backend/deals";
import { Task } from "@/lib/definitions/backend/tasks";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RightSidebarProps {
    deals: Deal[];
    appointments: Appointment[];
    tasks: Task[];
}
export default function RightSidebar({ deals: initialDeals, appointments: initialAppointments, tasks: initialTasks }: RightSidebarProps) {
    const [deals, setDeals] = useState(initialDeals);
    const [appointments, setAppointments] = useState(initialAppointments);
    const [tasks, setTasks] = useState(initialTasks);
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [dealModalOpen, setDealModalOpen] = useState(false);

    const [newTask, setNewTask] = useState({ title: '', type: 'call' as const, date: '', status: 'pending' as const, priority: 'normal' as const, note: '' });
    const [newAppointment, setNewAppointment] = useState({ title: '', scheduledAt: '', location: '', type: 'Buyer-appointment' as const, note: '' });
    const [newDeal, setNewDeal] = useState({ title: '', price: '', propertyAddress: '', propertyCity: '', propertyState: '', propertyZipCode: '', description: '', closingDate: '' });

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const formatDateShort = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const handleAddTask = async () => {
        toast.success('Task added successfully');
        setTaskModalOpen(false);
        setNewTask({ title: '', type: 'call', date: '', status: 'pending', priority: 'normal', note: '' });
    };

    const handleAddAppointment = async () => {
        toast.success('Appointment added successfully');
        setAppointmentModalOpen(false);
        setNewAppointment({ title: '', scheduledAt: '', location: '', type: 'Buyer-appointment', note: '' });
    };

    const handleAddDeal = async () => {
        toast.success('Deal added successfully');
        setDealModalOpen(false);
        setNewDeal({ title: '', price: '', propertyAddress: '', propertyCity: '', propertyState: '', propertyZipCode: '', description: '', closingDate: '' });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'normal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'low': return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400';
            default: return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400';
        }
    };

    return (
        <div className="w-80 flex-shrink-0 flex flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            {/* Tasks */}
            <div className="flex-1 overflow-y-auto border-b border-zinc-200 dark:border-zinc-800">
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Tasks ({tasks.length})</h3>
                    <Dialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
                        <DialogTrigger asChild>
                            <button className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Task</DialogTitle>
                                <DialogDescription>Create a new task for this contact</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div><Label>Title</Label><Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} /></div>
                                <div><Label>Type</Label><Select value={newTask.type} onValueChange={(v) => setNewTask({ ...newTask, type: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="call">Call</SelectItem><SelectItem value="email">Email</SelectItem><SelectItem value="follow-up">Follow-up</SelectItem><SelectItem value="text">Text</SelectItem><SelectItem value="showing">Showing</SelectItem><SelectItem value="closing">Closing</SelectItem></SelectContent></Select></div>
                                <div><Label>Priority</Label><Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
                                <div><Label>Date</Label><Input type="datetime-local" value={newTask.date} onChange={(e) => setNewTask({ ...newTask, date: e.target.value })} /></div>
                                <div><Label>Note</Label><Textarea value={newTask.note} onChange={(e) => setNewTask({ ...newTask, note: e.target.value })} rows={3} /></div>
                            </div>
                            <DialogFooter><Button onClick={handleAddTask}>Add Task</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="p-4 space-y-3">
                    {tasks.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-8">No tasks yet</p>
                    ) : (
                        tasks.map(task => (
                            <div key={task.ID} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-50">{task.Title}</h4>
                                    {task.Priority.Valid && <Badge className={getPriorityColor(task.Priority.TaskPriority)}>{task.Priority.TaskPriority}</Badge>}
                                </div>
                                {task.Type.Valid && <Badge variant="outline" className="text-xs mb-2">{task.Type.TaskType}</Badge>}
                                {task.Date.Valid && <p className="text-xs text-zinc-600 dark:text-zinc-400">{formatDateShort(task.Date.Time)}</p>}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Appointments */}
            <div className="flex-1 overflow-y-auto border-b border-zinc-200 dark:border-zinc-800">
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Appointments ({appointments.length})</h3>
                    <Dialog open={appointmentModalOpen} onOpenChange={setAppointmentModalOpen}>
                        <DialogTrigger asChild>
                            <button className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Appointment</DialogTitle>
                                <DialogDescription>Schedule a new appointment</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div><Label>Title</Label><Input value={newAppointment.title} onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })} /></div>
                                <div><Label>Type</Label><Select value={newAppointment.type} onValueChange={(v) => setNewAppointment({ ...newAppointment, type: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Listing-appointment">Listing Appointment</SelectItem><SelectItem value="Buyer-appointment">Buyer Appointment</SelectItem></SelectContent></Select></div>
                                <div><Label>Date & Time</Label><Input type="datetime-local" value={newAppointment.scheduledAt} onChange={(e) => setNewAppointment({ ...newAppointment, scheduledAt: e.target.value })} /></div>
                                <div><Label>Location</Label><Input value={newAppointment.location} onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })} /></div>
                                <div><Label>Note</Label><Textarea value={newAppointment.note} onChange={(e) => setNewAppointment({ ...newAppointment, note: e.target.value })} rows={3} /></div>
                            </div>
                            <DialogFooter><Button onClick={handleAddAppointment}>Add Appointment</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="p-4 space-y-3">
                    {appointments.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-8">No appointments yet</p>
                    ) : (
                        appointments.map(apt => (
                            <div key={apt.ID} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                                <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-50 mb-1">{apt.Title}</h4>
                                {apt.Type.Valid && <Badge variant="outline" className="text-xs mb-2">{apt.Type.AppointmentType}</Badge>}
                                <p className="text-xs text-zinc-600 dark:text-zinc-400">{formatDate(apt.ScheduledAt)}</p>
                                {apt.Location.Valid && <p className="text-xs text-zinc-500 mt-1">{apt.Location.String}</p>}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Deals */}
            <div className="flex-1 overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Deals ({deals.length})</h3>
                    <Dialog open={dealModalOpen} onOpenChange={setDealModalOpen}>
                        <DialogTrigger asChild>
                            <button className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Deal</DialogTitle>
                                <DialogDescription>Create a new deal for this contact</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div><Label>Title</Label><Input value={newDeal.title} onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })} /></div>
                                <div><Label>Price</Label><Input type="number" value={newDeal.price} onChange={(e) => setNewDeal({ ...newDeal, price: e.target.value })} placeholder="0" /></div>
                                <div><Label>Property Address</Label><Input value={newDeal.propertyAddress} onChange={(e) => setNewDeal({ ...newDeal, propertyAddress: e.target.value })} /></div>
                                <div className="grid grid-cols-2 gap-2"><div><Label>City</Label><Input value={newDeal.propertyCity} onChange={(e) => setNewDeal({ ...newDeal, propertyCity: e.target.value })} /></div><div><Label>State</Label><Input value={newDeal.propertyState} onChange={(e) => setNewDeal({ ...newDeal, propertyState: e.target.value })} /></div></div>
                                <div><Label>Closing Date</Label><Input type="date" value={newDeal.closingDate} onChange={(e) => setNewDeal({ ...newDeal, closingDate: e.target.value })} /></div>
                                <div><Label>Description</Label><Textarea value={newDeal.description} onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })} rows={3} /></div>
                            </div>
                            <DialogFooter><Button onClick={handleAddDeal}>Add Deal</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="p-4 space-y-3">
                    {deals.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-8">No deals yet</p>
                    ) : (
                        deals.map(deal => (
                            <div key={deal.ID} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                                <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-50 mb-1">{deal.Title}</h4>
                                <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">${deal.Price.toLocaleString()}</p>
                                {deal.PropertyAddress.Valid && <p className="text-xs text-zinc-600 dark:text-zinc-400">{deal.PropertyAddress.String}</p>}
                                {deal.ClosingDate.Valid && <p className="text-xs text-zinc-500 mt-1">Closing: {formatDateShort(deal.ClosingDate.Time)}</p>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
