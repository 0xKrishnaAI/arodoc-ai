import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SOSButton from '../components/SOSButton';
import DeleteModal from '../components/DeleteModal';
import axios from 'axios';
import { UserPlus, Phone, Trash2, ShieldAlert, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Emergency = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ name: '', phone_number: '', relationship: '' });
    const [showForm, setShowForm] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);

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
        <div className="min-h-screen bg-background pb-32 lg:pb-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-50 via-background to-background">
            <Navbar />
            <div className="max-w-xl mx-auto px-6 py-8 pt-28 lg:pt-12">
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-red-100/50 rounded-full mb-4 text-red-600 ring-1 ring-red-200">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Emergency Hub</h1>
                    <p className="text-slate-500 text-lg font-medium">Quick Actions & Trusted Contacts</p>
                </header>

                <div className="mb-12 flex justify-center scale-110">
                    <SOSButton />
                </div>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 md:p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Emergency Contacts</h2>
                            <p className="text-sm text-slate-500">People to notify in case of SOS</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add New
                        </button>
                    </div>

                    {showForm && (
                        <motion.form
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            onSubmit={handleAddContact}
                            className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200"
                        >
                            <h3 className="font-bold text-slate-900 mb-4">New Contact Details</h3>
                            <div className="grid gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Full Name</label>
                                    <input
                                        placeholder="e.g. John Doe"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                        value={newContact.name}
                                        onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Phone Number</label>
                                        <input
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                            value={newContact.phone_number}
                                            onChange={e => setNewContact({ ...newContact, phone_number: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Relationship</label>
                                        <input
                                            placeholder="e.g. Son, Doctor"
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                            value={newContact.relationship}
                                            onChange={e => setNewContact({ ...newContact, relationship: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 py-3 text-slate-500 font-semibold hover:bg-slate-100 rounded-xl transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary/20"
                                    >
                                        Save Contact
                                    </button>
                                </div>
                            </div>
                        </motion.form>
                    )}

                    <div className="space-y-4">
                        {contacts.length === 0 && (
                            <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium">No emergency contacts listed.</p>
                                <p className="text-sm text-slate-400">Add family members or doctors.</p>
                            </div>
                        )}
                        {contacts.map((contact) => (
                            <div key={contact.id} className="flex items-center justify-between p-4 bg-white/60 border border-slate-100/50 hover:border-primary/20 hover:bg-white transition rounded-2xl group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary-50 p-3 rounded-xl text-primary font-bold">
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{contact.name}</p>
                                        <p className="text-xs font-semibold text-primary uppercase tracking-wide mt-0.5">{contact.relationship}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="hidden sm:block font-mono text-sm font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{contact.phone_number}</span>
                                    <a href={`tel:${contact.phone_number}`} className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition">
                                        <Phone className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => setContactToDelete(contact)}
                                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        title="Delete Contact"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
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
