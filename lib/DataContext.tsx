'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, KeywordRanking, MonthlyPlan, mockTasks, mockKeywords, mockPlans } from './data';

interface DataContextType {
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [keywords, setKeywords] = useState<KeywordRanking[]>(mockKeywords);
  const [plans, setPlans] = useState<MonthlyPlan[]>(mockPlans);

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...taskData } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addKeyword = (kwData: Omit<KeywordRanking, 'id' | 'history' | 'currentRank' | 'previousRank'>) => {
    const newKeyword: KeywordRanking = {
      ...kwData,
      id: Math.random().toString(36).substr(2, 9),
      history: [],
      currentRank: 0,
      previousRank: 0,
    };
    setKeywords([newKeyword, ...keywords]);
  };

  const updateKeyword = (id: string, kwData: Partial<KeywordRanking>) => {
    setKeywords(keywords.map(k => k.id === id ? { ...k, ...kwData } : k));
  };

  const deleteKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  const checkKeywordRank = async (id: string) => {
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

      setKeywords(prev => prev.map(k => {
        if (k.id === id) {
          const today = new Date().toISOString().split('T')[0];
          const newHistory = [...k.history];
          const todayIndex = newHistory.findIndex(h => h.date === today);
          
          if (todayIndex >= 0) {
            newHistory[todayIndex].rank = newRank;
          } else {
            newHistory.push({ date: today, rank: newRank });
          }

          return {
            ...k,
            previousRank: k.currentRank,
            currentRank: newRank,
            url: foundUrl || k.url, // Cập nhật URL chính xác tìm được
            history: newHistory
          };
        }
        return k;
      }));
    } catch (error) {
      console.error('Check rank error:', error);
      alert('Có lỗi xảy ra khi kiểm tra thứ hạng.');
    }
  };

  const addPlan = (planData: Omit<MonthlyPlan, 'id' | 'progress'>) => {
    const newPlan: MonthlyPlan = {
      ...planData,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
    };
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (id: string, planData: Partial<MonthlyPlan>) => {
    setPlans(plans.map(p => p.id === id ? { ...p, ...planData } : p));
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const computedPlans = plans.map(plan => {
    const planTasks = tasks.filter(t => t.month === plan.month);
    const totalTasks = planTasks.length;
    const completedTasks = planTasks.filter(t => t.status === 'done').length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    return { ...plan, progress };
  });

  return (
    <DataContext.Provider value={{ 
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
      deletePlan 
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
