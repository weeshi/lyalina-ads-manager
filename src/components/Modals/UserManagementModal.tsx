// @ts-nocheck
import { useState, useEffect, memo } from 'react';
import { collection, onSnapshot, query, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import ModalWrapper from './ModalWrapper';
import { db, secondaryAuth, auth, appId } from '../../firebase';
import { generateId, safeRender, translateAuthError } from '../../utils';
import { Key, Loader2, Trash2 } from 'lucide-react';

const UserManagementModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('sales');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [systemUsers, setSystemUsers] = useState([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'system_users'));
        const unsub = onSnapshot(q, (snap) => {
            setSystemUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
        });
        return () => unsub();
    }, [isOpen]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_users', userCredential.user.uid), {
                email, name, role: role, isActive: true, createdAt: serverTimestamp()
            });
            await signOut(secondaryAuth);
            setMessage({ text: 'تم إنشاء حساب الموظف بنجاح!', type: 'success' });
            setEmail(''); setPassword(''); setName(''); setRole('sales');
        } catch (error) {
            setMessage({ text: translateAuthError(error.code), type: 'error' });
        }
        setIsLoading(false);
    };

    const toggleUserStatus = async (user) => {
        try {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_users', user.id), { isActive: user.isActive === false ? true : false }, { merge: true });
            setMessage({ text: `تم ${user.isActive === false ? 'تنشيط' : 'إيقاف'} الحساب بنجاح`, type: 'success' });
        } catch(e) { setMessage({ text: 'حدث خطأ أثناء التحديث', type: 'error' }); }
    };

    const changeUserRole = async (userId, newRole) => {
        try { await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_users', userId), { role: newRole }, { merge: true }); setMessage({ text: 'تم تحديث الصلاحية', type: 'success' }); } catch(e) { }
    };

    const handleResetPassword = async (userEmail) => {
        try { await sendPasswordResetEmail(auth, userEmail); setMessage({ text: `تم إرسال رابط لإعادة التعيين إلى ${userEmail}`, type: 'success' }); } catch(e) { setMessage({ text: 'حدث خطأ أثناء إرسال الرابط', type: 'error' }); }
    };

    const handleDeleteUser = async (userId) => {
        try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_users', userId)); setConfirmDeleteId(null); setMessage({ text: 'تم حذف سجل الموظف', type: 'success' }); } catch(e) { setMessage({ text: 'حدث خطأ أثناء الحذف', type: 'error' }); }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="إدارة حسابات الموظفين" icon={<Key size={20} className="text-amber-600"/>}>
            <div className="space-y-6">
                <form onSubmit={handleCreateUser} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">إنشاء حساب جديد</h4>
                    {message.text && <div className={`text-xs font-bold p-2 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{message.text}</div>}
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 outline-none text-sm font-bold text-slate-700" placeholder="اسم الموظف" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 outline-none text-sm font-bold text-slate-700" placeholder="البريد الإلكتروني" />
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 outline-none text-sm font-bold text-slate-700" placeholder="كلمة المرور (6 أحرف على الأقل)" />
                    <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 outline-none text-sm font-bold text-slate-700 bg-white cursor-pointer">
                        <option value="sales">موظف مبيعات (Sales)</option>
                        <option value="marketer">مسوق (Marketer)</option>
                        <option value="admin">مدير فرعي (Admin)</option>
                    </select>
                    <button type="submit" disabled={isLoading} className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-bold hover:bg-slate-700 text-sm flex justify-center items-center">
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : "تسجيل الموظف"}
                    </button>
                </form>
                <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-2">الحسابات المسجلة بالمستودع</h4>
                    <div className="max-h-60 overflow-y-auto space-y-3 border border-slate-100 rounded-xl p-3 bg-white shadow-inner">
                        {systemUsers.map(u => (
                            <div key={u.id} className={`flex flex-col gap-2 p-3 rounded-xl border ${u.isActive === false ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className={`font-bold text-sm ${u.isActive === false ? 'text-red-700 line-through' : 'text-slate-800'}`}>{safeRender(u.name)}</span>
                                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{safeRender(u.email)}</span>
                                    </div>
                                    <select value={u.role || 'sales'} onChange={(e) => changeUserRole(u.id, e.target.value)} className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-600 outline-none shadow-sm cursor-pointer">
                                        <option value="sales">مبيعات</option>
                                        <option value="marketer">مسوق</option>
                                        <option value="admin">مدير</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-200/60">
                                    <button onClick={() => toggleUserStatus(u)} className={`px-3 py-1.5 rounded-lg font-bold text-[10px] shadow-sm transition-colors ${u.isActive === false ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
                                        {u.isActive === false ? 'تنشيط الحساب' : 'إيقاف (تجميد)'}
                                    </button>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleResetPassword(u.email)} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-blue-100 shadow-sm transition-colors" title="إرسال رابط لتغيير الرقم السري">سر</button>
                                        {confirmDeleteId === u.id ? (
                                            <button onClick={() => handleDeleteUser(u.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm animate-pulse">تأكيد!</button>
                                        ) : (
                                            <button onClick={() => setConfirmDeleteId(u.id)} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-100 shadow-sm transition-colors"><Trash2 size={14}/></button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {systemUsers.length === 0 && <div className="text-[10px] text-center text-slate-400 p-2">لا توجد حسابات مسجلة بعد.</div>}
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default memo(UserManagementModal);
