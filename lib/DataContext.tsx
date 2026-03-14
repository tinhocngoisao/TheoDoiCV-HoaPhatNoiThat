'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task, KeywordRanking, MonthlyPlan } from './data';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, orderBy, where, getDoc } from 'firebase/firestore';
import { LogIn } from 'lucide-react';

interface Workspace {
  id: string;
  email: string;
}

interface DataContextType {
  user: User | null;
  currentWorkspaceId: string;
  setCurrentWorkspaceId: (id: string) => void;
  workspaces: Workspace[];
  sharedWith: string[];
  addSharedEmail: (email: string) => Promise<void>;
  removeSharedEmail: (email: string) => Promise<void>;
  tasks: Task[];
  keywords: KeywordRanking[];
  plans: MonthlyPlan[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addKeyword: (keyword: Omit<KeywordRanking, 'id' | 'history' | 'currentRank' | 'previousRank'>) => void;
  updateKeyword: (id: string, keyword: Partial<KeywordRanking>) => void;
  deleteKeyword: (id: string) => void;
  checkKeywordRank: (id: string) => Promise<void>;
  addPlan: (plan: Omit<MonthlyPlan, 'id' | 'progress'>) => void;
  updatePlan: (id: string, plan: Partial<MonthlyPlan>) => void;
  deletePlan: (id: string) => void;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  alert('Lỗi truy cập dữ liệu: ' + (error instanceof Error ? error.message : ''));
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [keywords, setKeywords] = useState<KeywordRanking[]>([]);
  const [plans, setPlans] = useState<MonthlyPlan[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user) return;

    const userRef = doc(db, `users/${user.uid}`);
    getDoc(userRef).then(docSnap => {
      if (!docSnap.exists()) {
        setDoc(userRef, { email: user.email, sharedWith: [] });
      }
    });

    const unsubUser = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setSharedWith(doc.data().sharedWith || []);
      }
    });

    const sharedQuery = query(collection(db, 'users'), where('sharedWith', 'array-contains', user.email));
    const unsubShared = onSnapshot(sharedQuery, (snapshot) => {
      const shared = snapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email || 'Unknown'
      }));
      setWorkspaces([{ id: user.uid, email: 'Cá nhân (Của tôi)' }, ...shared]);
    });

    if (!currentWorkspaceId) {
      setCurrentWorkspaceId(user.uid);
    }

    return () => {
      unsubUser();
      unsubShared();
    };
  }, [user, isAuthReady]);

  useEffect(() => {
    if (!isAuthReady || !user || !currentWorkspaceId) return;

    const tasksRef = collection(db, `users/${currentWorkspaceId}/tasks`);
    const keywordsRef = collection(db, `users/${currentWorkspaceId}/keywords`);
    const plansRef = collection(db, `users/${currentWorkspaceId}/plans`);

    const unsubTasks = onSnapshot(query(tasksRef, orderBy('createdAt', 'desc')), (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, `users/${currentWorkspaceId}/tasks`));

    const unsubKeywords = onSnapshot(query(keywordsRef, orderBy('createdAt', 'desc')), (snapshot) => {
      setKeywords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as KeywordRanking)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, `users/${currentWorkspaceId}/keywords`));

    const unsubPlans = onSnapshot(query(plansRef, orderBy('createdAt', 'desc')), (snapshot) => {
      setPlans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MonthlyPlan)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, `users/${currentWorkspaceId}/plans`));

    return () => {
      unsubTasks();
      unsubKeywords();
      unsubPlans();
    };
  }, [user, isAuthReady, currentWorkspaceId]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const addSharedEmail = async (email: string) => {
    if (!user) return;
    const ref = doc(db, `users/${user.uid}`);
    try {
      const newSharedWith = [...sharedWith, email];
      await updateDoc(ref, { sharedWith: newSharedWith });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, ref.path);
    }
  };

  const removeSharedEmail = async (email: string) => {
    if (!user) return;
    const ref = doc(db, `users/${user.uid}`);
    try {
      const newSharedWith = sharedWith.filter(e => e !== email);
      await updateDoc(ref, { sharedWith: newSharedWith });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, ref.path);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    if (!user || !currentWorkspaceId) return;
    const id = Math.random().toString(36).substr(2, 9);
    const ref = doc(db, `users/${currentWorkspaceId}/tasks/${id}`);
    try {
      await setDoc(ref, {
        ...taskData,
        userId: currentWorkspaceId,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, ref.path);
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    if (!user || !currentWorkspaceId) return;
    const ref = doc(db, `users/${currentWorkspaceId}/tasks/${id}`);
    try {
      await updateDoc(ref, taskData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, ref.path);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user || !currentWorkspaceId) return;
    const ref = doc(db, `users/${currentWorkspaceId}/tasks/${id}`);
    try {
      await deleteDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, ref.path);
    }
  };

  const addKeyword = async (kwData: Omit<KeywordRanking, 'id' | 'history' | 'currentRank' | 'previousRank'>) => {
    if (!user || !currentWorkspaceId) return;
    const id = Math.random().toString(36).substr(2, 9);
    const ref = doc(db, `users/${currentWorkspaceId}/keywords/${id}`);
    try {
      await setDoc(ref, {
        ...kwData,
        history: [],
        currentRank: 0,
        previousRank: 0,
        userId: currentWorkspaceId,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, ref.path);
    }
  };

  const updateKeyword = async (id: string, kwData: Partial<KeywordRanking>) => {
    if (!user || !currentWorkspaceId) return;
    const ref = doc(db, `users/${currentWorkspaceId}/keywords/${id}`);
    try {
      await updateDoc(ref, kwData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, ref.path);
    }
  };

  const deleteKeyword = async (id: string) => {
    if (!user || !currentWorkspaceId) return;
    const ref = doc(db, `users/${currentWorkspaceId}/keywords/${id}`);
    try {
      await deleteDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, ref.path);
    }
  };

  const checkKeywordRank = async (id: string) => {
    if (!user || !currentWorkspaceId) return;
    const keywordToCheck = keywords.find(k => k.id === id);
    if (!keywordToCheck) return;

    try {
      const response = await fetch('/api/check-rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          keyword: keywordToCheck.keyword, 
          domain: 'hoaphatnoithat.net.vn' 
        })
      });

      if (!response.ok) throw new Error('Failed to check rank');
      
      const data = await response.json();
      const newRank = data.rank; // 0 means not found in top 100
      const foundUrl = data.url;

      const today = new Date().toISOString().split('T')[0];
      const newHistory = [...keywordToCheck.history];
      const todayIndex = newHistory.findIndex(h => h.date === today);
      
      if (todayIndex >= 0) {
        newHistory[todayIndex].rank = newRank;
      } else {
        newHistory.push({ date: today, rank: newRank });
      }

      const ref = doc(db, `users/${currentWorkspaceId}/keywords/${id}`);
      await updateDoc(ref, {
        previousRank: keywordToCheck.currentRank,
        currentRank: newRank,
        url: foundUrl || keywordToCheck.url,
        history: newHistory
      });

    } catch (error) {
      console.error('Check rank error:', error);
      // alert('Có lỗi xảy ra khi kiểm tra thứ hạng.');
    }
  };

  const addPlan = async (planData: Omit<MonthlyPlan, 'id' | 'progress'>) => {
    if (!user || !currentWorkspaceId) return;
    const id = Math.random().toString(36).substr(2, 9);
    const ref = doc(db, `users/${currentWorkspaceId}/plans/${id}`);
    try {
      await setDoc(ref, {
        ...planData,
        progress: 0,
        userId: currentWorkspaceId,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, ref.path);
    }
  };

  const updatePlan = async (id: string, planData: Partial<MonthlyPlan>) => {
    if (!user || !currentWorkspaceId) return;
    const ref = doc(db, `users/${currentWorkspaceId}/plans/${id}`);
    try {
      await updateDoc(ref, planData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, ref.path);
    }
  };

  const deletePlan = async (id: string) => {
    if (!user || !currentWorkspaceId) return;
    const ref = doc(db, `users/${currentWorkspaceId}/plans/${id}`);
    try {
      await deleteDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, ref.path);
    }
  };

  const computedPlans = plans.map(plan => {
    const planTasks = tasks.filter(t => t.month === plan.month);
    const totalTasks = planTasks.length;
    const completedTasks = planTasks.filter(t => t.status === 'done').length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    return { ...plan, progress };
  });

  if (!isAuthReady) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Đăng nhập để tiếp tục</h2>
          <p className="text-slate-500 mb-8">Dữ liệu SEO của bạn sẽ được lưu trữ an toàn trên đám mây và có thể truy cập từ mọi thiết bị.</p>
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Đăng nhập với Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ 
      user,
      currentWorkspaceId,
      setCurrentWorkspaceId,
      workspaces,
      sharedWith,
      addSharedEmail,
      removeSharedEmail,
      tasks, 
      keywords, 
      plans: computedPlans, 
      addTask, 
      updateTask, 
      deleteTask, 
      addKeyword, 
      updateKeyword,
      deleteKeyword,
      checkKeywordRank,
      addPlan, 
      updatePlan, 
      deletePlan,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
