import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SOSButton from '../components/SOSButton';
import DeleteModal from '../components/DeleteModal';
import axios from 'axios';
import { UserPlus, Phone, Trash2, ShieldAlert, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Emergency = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ name: '', phone_number: '', relationship: '' });
    const [showForm, setShowForm] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/v1/emergency/contacts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setContacts(res.data);
        } catch (err) {
            console.error("Failed to fetch contacts", err);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleAddContact = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/v1/emergency/contacts', newContact, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setContacts([...contacts, res.data]);
            setNewContact({ name: '', phone_number: '', relationship: '' });
            setShowForm(false);
        } catch (err) {
            alert("Failed to add contact");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteContact = async () => {
        if (!contactToDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/v1/emergency/contacts/${contactToDelete.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setContacts(contacts.filter(c => c.id !== contactToDelete.id));
            setContactToDelete(null);
        } catch (err) {
            alert("Failed to delete contact");
        }
    };

    return (
        <div className="min-h-screen bg-background pb-32 lg:pb-12">
            <Navbar />

            {/* Enhanced red accent for emergency context */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[50%] transform -translate-x-1/2 w-[60%] h-[40%] rounded-full bg-red-100/40 blur-[120px] animate-pulse-soft"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-red-50/30 blur-[100px]"></div>
            </div>

            <div className="max-w-xl mx-auto px-6 py-8 pt-28 lg:pt-32">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-2xl mb-4 text-red-500 border border-red-100">
                        <ShieldAlert className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Emergency Hub</h1>
                    <p className="text-slate-500 text-lg">Quick Actions & Trusted Contacts</p>
                </motion.header>

                {/* SOS Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10 flex justify-center"
                >
                    <SOSButton />
                </motion.div>

                {/* Contacts Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Emergency Contacts</h2>
                            <p className="text-sm text-slate-500">People to notify in case of SOS</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary px-4 py-2 text-sm"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add New
                        </button>
                    </div>

                    {/* Add Contact Form */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.form
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                onSubmit={handleAddContact}
                                className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800">New Contact Details</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4 text-slate-500" />
                                    </button>
                                </div>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Full Name</label>
                                        <input
                                            placeholder="e.g. John Doe"
                                            className="input-field"
                                            value={newContact.name}
                                            onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Phone Number</label>
                                            <input
                                                placeholder="+91 98765 43210"
                                                className="input-field"
                                                value={newContact.phone_number}
                                                onChange={e => setNewContact({ ...newContact, phone_number: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Relationship</label>
                                            <input
                                                placeholder="e.g. Son, Doctor"
                                                className="input-field"
                                                value={newContact.relationship}
                                                onChange={e => setNewContact({ ...newContact, relationship: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 btn-ghost py-2.5"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-[2] btn-primary py-2.5 disabled:opacity-60"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                            Save Contact
                                        </button>
                                    </div>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Contact List */}
                    <div className="space-y-3">
                        {contacts.length === 0 && (
                            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium">No emergency contacts listed.</p>
                                <p className="text-sm text-slate-400">Add family members or doctors.</p>
                            </div>
                        )}
                        {contacts.map((contact) => (
                            <motion.div
                                key={contact.id}
                                layout
                                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 hover:border-primary-200 hover:bg-white transition-all duration-300 rounded-xl group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center text-primary font-bold border border-primary-100">
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{contact.name}</p>
                                        <p className="text-xs font-semibold text-primary uppercase tracking-wide">{contact.relationship}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="hidden sm:block font-mono text-sm font-medium text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-100">
                                        {contact.phone_number}
                                    </span>
                                    <a
                                        href={`tel:${contact.phone_number}`}
                                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors duration-300 border border-emerald-100"
                                    >
                                        <Phone className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => setContactToDelete(contact)}
                                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                                        title="Delete Contact"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </div>

            <DeleteModal
                isOpen={!!contactToDelete}
                itemName={contactToDelete?.name}
                onConfirm={handleDeleteContact}
                onCancel={() => setContactToDelete(null)}
            />
        </div>
    );
};

export default Emergency;
